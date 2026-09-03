import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ValidationError,
  requireEmail,
  requirePassword,
  requireRole,
  requireSelfAssignableRole,
  requireString,
} from '../src/utils/validation.js';

test('requireString rejects empty and oversized values', () => {
  assert.throws(() => requireString('', 'name'), ValidationError);
  assert.throws(() => requireString('abcdef', 'name', { max: 3 }), ValidationError);
  assert.equal(requireString('  ok  ', 'name'), 'ok');
});

test('requireEmail normalises and validates', () => {
  assert.equal(requireEmail(' User@Example.COM '), 'user@example.com');
  assert.throws(() => requireEmail('not-an-email'), ValidationError);
});

test('requirePassword enforces length and character classes', () => {
  assert.throws(() => requirePassword('short1'), ValidationError);
  assert.throws(() => requirePassword('alllettersonly'), ValidationError);
  assert.equal(requirePassword('goodpass1'), 'goodpass1');
});

test('self-assignable roles exclude admin', () => {
  assert.equal(requireSelfAssignableRole(undefined), 'candidate');
  assert.equal(requireSelfAssignableRole('interviewer'), 'interviewer');
  assert.throws(() => requireSelfAssignableRole('admin'), ValidationError);
  assert.equal(requireRole('admin'), 'admin');
});
