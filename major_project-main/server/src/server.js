import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedProblems } from './seeders/problemSeeder.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupInterviewSocket } from './sockets/interviewSocket.js';

import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect DB & Seed initial data
connectDB().then(() => {
  seedProblems();
});

// Setup Socket handlers
setupInterviewSocket(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Interview Platform API',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start HTTP Server
server.listen(config.port, () => {
  console.log(`===================================================`);
  console.log(`🚀 AI Interview Platform Server Running on Port ${config.port}`);
  console.log(`📡 Client URL: ${config.clientUrl}`);
  console.log(`===================================================`);
});
