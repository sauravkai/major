import dotenv from 'dotenv';

dotenv.config();

const INSECURE_JWT_SECRETS = new Set([
  'change_me',
  'secret',
  'ai_interview_platform_super_secret_jwt_key_2026',
]);

const bool = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const int = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const list = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';

export const config = {
  nodeEnv,
  isProduction,
  isTest: nodeEnv === 'test',
  port: int(process.env.PORT, 5000),
  host: process.env.HOST || '0.0.0.0',
  trustProxy: bool(process.env.TRUST_PROXY, isProduction),

  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-interview-platform',
  jwtSecret: process.env.JWT_SECRET || 'insecure_development_only_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',

  clientUrl,
  corsOrigins: list(process.env.CORS_ORIGINS).length ? list(process.env.CORS_ORIGINS) : [clientUrl],
  serveClient: bool(process.env.SERVE_CLIENT, false),

  // Demo identities and seeded sample data. Never enabled by default in production:
  // it exposes password-less sign-in for fixed roles.
  demoMode: bool(process.env.DEMO_MODE, !isProduction),

  authRateLimitMax: int(process.env.AUTH_RATE_LIMIT_MAX, 20),
  apiRateLimitMax: int(process.env.API_RATE_LIMIT_MAX, 600),
  codeRunRateLimitMax: int(process.env.CODE_RUN_RATE_LIMIT_MAX, 30),

  codeExecution: {
    enabled: bool(process.env.CODE_EXECUTION_ENABLED, true),
    // 'docker' isolates candidate code in a throwaway container; 'host' runs it
    // directly on the API process' machine and is rejected in production.
    runner: process.env.CODE_EXECUTION_RUNNER || (isProduction ? 'docker' : 'auto'),
    timeoutMs: int(process.env.CODE_EXECUTION_TIMEOUT_MS, 5000),
    memoryMb: int(process.env.CODE_EXECUTION_MEMORY_MB, 256),
    cpus: process.env.CODE_EXECUTION_CPUS || '0.5',
    maxCodeBytes: int(process.env.CODE_EXECUTION_MAX_CODE_BYTES, 64 * 1024),
    maxTestCases: int(process.env.CODE_EXECUTION_MAX_TEST_CASES, 25),
  },

  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  vapiApiKey: process.env.VAPI_API_KEY || '',
  vapiAssistantId: process.env.VAPI_ASSISTANT_ID || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
};

/**
 * Reject start-up configurations that are only safe on a developer machine.
 * Returns the list of problems so callers can decide how loudly to fail.
 */
export const validateConfig = (cfg = config) => {
  const errors = [];
  const warnings = [];

  if (cfg.isProduction) {
    if (!process.env.JWT_SECRET) {
      errors.push('JWT_SECRET must be set in production');
    } else if (INSECURE_JWT_SECRETS.has(process.env.JWT_SECRET) || process.env.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET must be a unique random value of at least 32 characters');
    }

    if (!process.env.MONGO_URI) errors.push('MONGO_URI must be set in production');
    if (!process.env.CLIENT_URL && !process.env.CORS_ORIGINS) {
      errors.push('CLIENT_URL (or CORS_ORIGINS) must be set in production');
    }
    if (cfg.corsOrigins.includes('*')) errors.push('CORS_ORIGINS must not be "*" in production');
    if (cfg.demoMode) errors.push('DEMO_MODE must be disabled in production');
    if (cfg.codeExecution.enabled && cfg.codeExecution.runner !== 'docker') {
      errors.push('CODE_EXECUTION_RUNNER must be "docker" in production (or disable code execution)');
    }
    if (cfg.razorpayKeyId && !cfg.razorpayWebhookSecret) {
      warnings.push('RAZORPAY_WEBHOOK_SECRET is not set; payment webhooks will be rejected');
    }
  }

  if (!cfg.geminiApiKey && !cfg.openaiApiKey) {
    warnings.push('No AI provider key configured; interview questions fall back to the static bank');
  }

  return { errors, warnings };
};
