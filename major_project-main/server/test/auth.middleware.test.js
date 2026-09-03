import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';
import { protect, authorize, requirePersistedAccount } from '../src/middleware/auth.js';

const mockRes = () => {
  const res = { statusCode: 200, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
};

const run = (middleware, req) =>
  new Promise((resolve) => {
    const res = mockRes();
    const next = (error) => resolve({ res, nextCalled: !error, error });
    const result = middleware(req, res, next);
    Promise.resolve(result).then(() => {
      if (res.body || res.statusCode !== 200) resolve({ res, nextCalled: false });
    });
  });

test('protect rejects requests without a token', async () => {
  const { res, nextCalled } = await run(protect, { headers: {} });
  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('protect rejects a forged token', async () => {
  const token = jwt.sign({ id: 'demo-interviewer', demo: true }, 'a-different-secret');
  const { res } = await run(protect, { headers: { authorization: `Bearer ${token}` } });
  assert.equal(res.statusCode, 401);
});

test('protect accepts a demo token only while demo mode is on', async () => {
  const token = jwt.sign(
    { id: 'demo-interviewer', role: 'interviewer', name: 'Demo', email: 'demo@demo.local', demo: true },
    config.jwtSecret
  );
  const req = { headers: { authorization: `Bearer ${token}` } };

  const allowed = await run(protect, req);
  assert.equal(allowed.nextCalled, config.demoMode);

  const originalDemoMode = config.demoMode;
  config.demoMode = false;
  const denied = await run(protect, { headers: { authorization: `Bearer ${token}` } });
  config.demoMode = originalDemoMode;
  assert.equal(denied.res.statusCode, 401);
});

test('authorize enforces roles and demo accounts cannot own persisted resources', async () => {
  const forbidden = await run(authorize('admin'), { user: { role: 'candidate' } });
  assert.equal(forbidden.res.statusCode, 403);

  const allowed = await run(authorize('admin'), { user: { role: 'admin' } });
  assert.equal(allowed.nextCalled, true);

  const demo = await run(requirePersistedAccount, { user: { _id: 'demo-candidate', isDemo: true } });
  assert.equal(demo.res.statusCode, 403);
});
