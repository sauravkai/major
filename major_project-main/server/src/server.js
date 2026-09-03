import http from 'http';
import { Server } from 'socket.io';
import { createApp, corsOptions } from './app.js';
import { config, validateConfig } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedProblems } from './seeders/problemSeeder.js';
import { setupInterviewSocket } from './sockets/interviewSocket.js';
import { logger } from './utils/logger.js';

const { errors, warnings } = validateConfig();
warnings.forEach((warning) => logger.warn(warning));
if (errors.length) {
  errors.forEach((error) => logger.error(`Invalid configuration: ${error}`));
  process.exit(1);
}

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

setupInterviewSocket(io);

const shutdown = async (signal) => {
  logger.info('Shutting down', { signal });
  const timer = setTimeout(() => process.exit(1), 10000);
  timer.unref();

  io.close();
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

const start = async () => {
  try {
    await connectDB();
    await seedProblems();
  } catch (error) {
    logger.error('Startup failed', { error: error.message });
    process.exit(1);
  }

  server.listen(config.port, config.host, () => {
    logger.info('API listening', {
      port: config.port,
      env: config.nodeEnv,
      demoMode: config.demoMode,
      corsOrigins: config.corsOrigins,
    });
  });
};

['SIGTERM', 'SIGINT'].forEach((signal) => process.on(signal, () => shutdown(signal)));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { error: reason instanceof Error ? reason.message : String(reason) });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

start();
