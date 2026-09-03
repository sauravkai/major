import { config } from '../config/env.js';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const threshold = LEVELS[process.env.LOG_LEVEL] ?? (config.isProduction ? LEVELS.info : LEVELS.debug);

const emit = (level, message, meta) => {
  if (LEVELS[level] > threshold) return;
  const entry = { level, time: new Date().toISOString(), message, ...(meta || {}) };
  const line = config.isProduction ? JSON.stringify(entry) : `[${level}] ${message}${meta ? ` ${JSON.stringify(meta)}` : ''}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

export const logger = {
  error: (message, meta) => emit('error', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  info: (message, meta) => emit('info', message, meta),
  debug: (message, meta) => emit('debug', message, meta),
};
