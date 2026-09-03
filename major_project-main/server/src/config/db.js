import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Connect to MongoDB, retrying with a linear backoff. Production refuses to serve
 * traffic without a database rather than silently degrading to in-memory data.
 */
export const connectDB = async ({ retries = config.isProduction ? 5 : 1, retryDelayMs = 3000 } = {}) => {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('MongoDB connected', { host: conn.connection.host, db: conn.connection.name });
      return conn;
    } catch (error) {
      logger.error('MongoDB connection failed', { attempt, retries, error: error.message });
      if (attempt < retries) await sleep(retryDelayMs * attempt);
    }
  }

  if (config.isProduction) {
    throw new Error(`Could not connect to MongoDB after ${retries} attempts`);
  }

  logger.warn('Continuing without MongoDB; database-backed features are unavailable');
  return null;
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
};
