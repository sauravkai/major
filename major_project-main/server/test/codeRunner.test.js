import test from 'node:test';
import assert from 'node:assert/strict';

// The sandbox picks its runner from config at import time; force host execution so
// the suite works on CI runners without a docker daemon.
process.env.NODE_ENV = 'test';
process.env.CODE_EXECUTION_RUNNER = 'host';
process.env.CODE_EXECUTION_TIMEOUT_MS = '10000';

const { runCodeService, resolveLanguage } = await import('../src/services/codeRunnerService.js');
const { ValidationError } = await import('../src/utils/validation.js');

const echoSolution = 'function solve(input) { return input.trim().split(" ").map(Number).reduce((a, b) => a + b, 0); }';

test('resolveLanguage accepts aliases and rejects unknown languages', () => {
  assert.equal(resolveLanguage('js'), 'javascript');
  assert.equal(resolveLanguage('c++'), 'cpp');
  assert.equal(resolveLanguage('brainfuck'), null);
});

test('passing solution reports every test case as accepted', async () => {
  const result = await runCodeService({
    code: echoSolution,
    language: 'javascript',
    testCases: [
      { input: '1 2', expectedOutput: '3' },
      { input: '10 5', expectedOutput: '15' },
    ],
  });

  assert.equal(result.status, 'Accepted');
  assert.equal(result.passCount, 2);
  assert.equal(result.totalCount, 2);
});

test('wrong output is reported as a wrong answer', async () => {
  const result = await runCodeService({
    code: 'function solve() { return 42; }',
    language: 'javascript',
    testCases: [{ input: '1 2', expectedOutput: '3' }],
  });

  assert.equal(result.status, 'Wrong Answer');
  assert.equal(result.passCount, 0);
});

test('runtime errors are surfaced without crashing the runner', async () => {
  const result = await runCodeService({
    code: 'function solve() { throw new Error("boom"); }',
    language: 'javascript',
    testCases: [{ input: '', expectedOutput: '' }],
  });

  assert.equal(result.status, 'Runtime Error');
  assert.match(result.testResults[0].error, /boom/);
});

test('oversized and empty submissions are rejected', async () => {
  await assert.rejects(() => runCodeService({ code: '   ', language: 'javascript' }), ValidationError);
  await assert.rejects(
    () => runCodeService({ code: 'x'.repeat(1024 * 1024), language: 'javascript' }),
    ValidationError
  );
});

test('unsupported languages are rejected before execution', async () => {
  await assert.rejects(
    () => runCodeService({ code: 'print(1)', language: 'ruby', testCases: [] }),
    ValidationError
  );
});
