import { randomUUID } from 'crypto';
import { resolveUserFromToken } from '../middleware/auth.js';
import { Interview } from '../models/Interview.js';
import { isDbConnected } from '../config/db.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const MAX_CODE_LENGTH = 200000;
const MAX_CHAT_LENGTH = 2000;
const LANGUAGES = ['javascript', 'python', 'cpp', 'java'];

/**
 * Room membership is derived from the interview record so a room id alone never
 * grants access to another candidate's session.
 */
const canJoinRoom = async (user, roomId) => {
  if (!isDbConnected()) return config.demoMode;

  const interview = await Interview.findOne({ roomId }).select('candidateId interviewerId');
  if (!interview) return config.demoMode;
  if (user.role === 'admin') return true;

  return [interview.candidateId, interview.interviewerId]
    .filter(Boolean)
    .map(String)
    .includes(String(user._id));
};

export const setupInterviewSocket = (io) => {
  const roomState = new Map();

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const user = await resolveUserFromToken(String(token));
      if (!user) return next(new Error('Authentication required'));
      socket.data.user = {
        id: String(user._id),
        name: user.name,
        role: user.role,
        avatar: user.avatar || '',
      };
      return next();
    } catch {
      return next(new Error('Authentication required'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    logger.debug('Socket connected', { socketId: socket.id, userId: user.id });

    socket.on('join-room', async ({ roomId } = {}) => {
      if (typeof roomId !== 'string' || !roomId) return;

      try {
        if (!(await canJoinRoom(user, roomId))) {
          socket.emit('room-access-denied', { roomId });
          return;
        }
      } catch (error) {
        logger.error('Room authorization failed', { error: error.message, roomId });
        socket.emit('room-access-denied', { roomId });
        return;
      }

      socket.join(roomId);

      if (!roomState.has(roomId)) {
        roomState.set(roomId, {
          code: '// Select a language and start coding...',
          language: 'javascript',
          participants: new Map(),
          timerSeconds: 45 * 60,
        });
      }

      const room = roomState.get(roomId);
      const participantInfo = { socketId: socket.id, user, joinedAt: new Date() };
      room.participants.set(socket.id, participantInfo);

      socket.emit('room-state-init', {
        code: room.code,
        language: room.language,
        participants: Array.from(room.participants.values()),
        timerSeconds: room.timerSeconds,
      });

      socket.to(roomId).emit('user-joined-room', {
        participant: participantInfo,
        participants: Array.from(room.participants.values()),
      });
    });

    const inRoom = (roomId) => typeof roomId === 'string' && socket.rooms.has(roomId);

    socket.on('code-change', ({ roomId, code, language } = {}) => {
      if (!inRoom(roomId) || typeof code !== 'string' || code.length > MAX_CODE_LENGTH) return;

      const room = roomState.get(roomId);
      if (room) {
        room.code = code;
        if (LANGUAGES.includes(language)) room.language = language;
      }
      socket.to(roomId).emit('code-update', { code, language, updatedBy: socket.id });
    });

    socket.on('language-change', ({ roomId, language } = {}) => {
      if (!inRoom(roomId) || !LANGUAGES.includes(language)) return;

      const room = roomState.get(roomId);
      if (room) room.language = language;
      socket.to(roomId).emit('language-update', { language });
    });

    socket.on('cursor-move', ({ roomId, cursorPosition } = {}) => {
      if (!inRoom(roomId)) return;
      socket.to(roomId).emit('cursor-update', { socketId: socket.id, cursorPosition, user });
    });

    socket.on('send-chat-message', ({ roomId, message } = {}) => {
      if (!inRoom(roomId) || typeof message !== 'string' || !message.trim()) return;

      io.in(roomId).emit('new-chat-message', {
        id: `msg_${randomUUID()}`,
        text: message.slice(0, MAX_CHAT_LENGTH),
        sender: user.name,
        role: user.role,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    socket.on('webrtc-offer', ({ roomId, offer } = {}) => {
      if (!inRoom(roomId)) return;
      socket.to(roomId).emit('webrtc-offer-received', { offer, senderSocketId: socket.id });
    });

    socket.on('webrtc-answer', ({ roomId, answer } = {}) => {
      if (!inRoom(roomId)) return;
      socket.to(roomId).emit('webrtc-answer-received', { answer, senderSocketId: socket.id });
    });

    socket.on('webrtc-ice-candidate', ({ roomId, candidate } = {}) => {
      if (!inRoom(roomId)) return;
      socket.to(roomId).emit('webrtc-ice-candidate-received', { candidate, senderSocketId: socket.id });
    });

    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        if (roomId === socket.id || !roomState.has(roomId)) continue;

        const room = roomState.get(roomId);
        const leavingUser = room.participants.get(socket.id);
        room.participants.delete(socket.id);

        socket.to(roomId).emit('user-left-room', {
          socketId: socket.id,
          user: leavingUser?.user,
          participants: Array.from(room.participants.values()),
        });

        if (room.participants.size === 0) roomState.delete(roomId);
      }
    });
  });
};
