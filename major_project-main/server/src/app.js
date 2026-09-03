import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/env.js';
import { isDbConnected } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { requestLogger } from './middleware/requestLogger.js';
import { handleWebhook } from './controllers/paymentController.js';

import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const corsOptions = {
  origin(origin, callback) {
    // Same-origin requests and server-to-server callers send no Origin header.
    if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

export const createApp = () => {
  const app = express();

  if (config.trustProxy) app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      // The SPA is served from its own origin and loads Monaco/Daily assets over https.
      contentSecurityPolicy: config.serveClient ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(requestLogger);

  // Razorpay signs the raw request body, so this route must be parsed before express.json().
  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(mongoSanitize());

  app.get('/api/health', (req, res) => {
    const dbConnected = isDbConnected();
    res.status(dbConnected || !config.isProduction ? 200 : 503).json({
      status: dbConnected ? 'ok' : 'degraded',
      service: 'AI Interview Platform API',
      env: config.nodeEnv,
      database: dbConnected ? 'connected' : 'disconnected',
      demoMode: config.demoMode,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', apiLimiter);
  app.use('/api/auth', authRoutes);
  app.use('/api/problems', problemRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/payments', paymentRoutes);

  app.use('/api', notFound);

  if (config.serveClient) {
    const clientDist = path.resolve(__dirname, '../../client/dist');
    app.use(express.static(clientDist, { maxAge: '1h', index: false }));
    app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  } else {
    app.use(notFound);
  }

  app.use(errorHandler);

  return app;
};
