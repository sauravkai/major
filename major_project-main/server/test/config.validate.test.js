import test from 'node:test';
import assert from 'node:assert/strict';
import { config, validateConfig } from '../src/config/env.js';

const productionConfig = (overrides = {}) => ({
  ...config,
  isProduction: true,
  corsOrigins: ['https://app.example.com'],
  demoMode: false,
  codeExecution: { ...config.codeExecution, enabled: true, runner: 'docker' },
  ...overrides,
});

const withEnv = (vars, fn) => {
  const previous = {};
  for (const [key, value] of Object.entries(vars)) {
    previous[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

const productionEnv = {
  JWT_SECRET: 'x'.repeat(48),
  MONGO_URI: 'mongodb://mongo:27017/app',
  CLIENT_URL: 'https://app.example.com',
};

test('a fully configured production environment passes', () => {
  const { errors } = withEnv(productionEnv, () => validateConfig(productionConfig()));
  assert.deepEqual(errors, []);
});

test('production rejects weak or missing secrets', () => {
  const missing = withEnv({ ...productionEnv, JWT_SECRET: undefined }, () =>
    validateConfig(productionConfig())
  );
  assert.match(missing.errors.join(' '), /JWT_SECRET must be set/);

  const weak = withEnv({ ...productionEnv, JWT_SECRET: 'change_me' }, () =>
    validateConfig(productionConfig())
  );
  assert.match(weak.errors.join(' '), /unique random value/);
});

test('production rejects demo mode, wildcard CORS and host code execution', () => {
  const { errors } = withEnv(productionEnv, () =>
    validateConfig(
      productionConfig({
        demoMode: true,
        corsOrigins: ['*'],
        codeExecution: { ...config.codeExecution, enabled: true, runner: 'host' },
      })
    )
  );

  const joined = errors.join(' ');
  assert.match(joined, /DEMO_MODE must be disabled/);
  assert.match(joined, /CORS_ORIGINS must not be "\*"/);
  assert.match(joined, /CODE_EXECUTION_RUNNER must be "docker"/);
});
