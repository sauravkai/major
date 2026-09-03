import { execFile } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../utils/validation.js';

const execFilePromise = util.promisify(execFile);

const MAX_OUTPUT_BYTES = 64 * 1024;

/**
 * Per-language image, source file name and the argv executed inside the sandbox.
 * Compilation happens in /tmp because the source mount is read-only.
 */
const LANGUAGES = {
  javascript: {
    image: 'node:18-alpine',
    file: 'solution.js',
    command: ['node', '/app/solution.js'],
    hostCommand: (dir) => ['node', [path.join(dir, 'solution.js')]],
    wrap: (code) => `
const fs = require('fs');
const path = require('path');

let input = '';
try {
  input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
} catch (e) {
  input = '';
}

${code}

if (typeof solve === 'function') {
  const res = solve(input);
  if (res !== undefined) console.log(res);
}
`,
  },
  python: {
    image: 'python:3.11-slim',
    file: 'solution.py',
    command: ['python', '/app/solution.py'],
    hostCommand: (dir) => ['python3', [path.join(dir, 'solution.py')]],
    wrap: (code) => `
import os

input_file = os.path.join(os.path.dirname(__file__), 'input.txt')
input_data = ""
if os.path.exists(input_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        input_data = f.read()

${code}

if 'solve' in globals():
    res = solve(input_data)
    if res is not None:
        print(res)
`,
  },
  cpp: {
    image: 'gcc:13',
    file: 'solution.cpp',
    command: ['bash', '-c', 'g++ -O2 -o /tmp/solution /app/solution.cpp && /tmp/solution < /app/input.txt'],
    hostCommand: (dir) => [
      'bash',
      ['-c', `g++ -O2 -o "${dir}/solution" "${dir}/solution.cpp" && "${dir}/solution" < "${dir}/input.txt"`],
    ],
    wrap: (code) => code,
  },
  java: {
    image: 'eclipse-temurin:17-jdk',
    file: 'Solution.java',
    command: [
      'bash',
      '-c',
      'javac -d /tmp /app/Solution.java && java -cp /tmp Solution < /app/input.txt',
    ],
    hostCommand: (dir) => [
      'bash',
      ['-c', `javac -d "${dir}" "${dir}/Solution.java" && java -cp "${dir}" Solution < "${dir}/input.txt"`],
    ],
    // Editors hand us either a full `Solution` class or a bare method body.
    wrap: (code) =>
      /\bclass\s+Solution\b/.test(code)
        ? code
        : `import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n${code}\n}\n`,
  },
};

const ALIASES = { node: 'javascript', js: 'javascript', 'c++': 'cpp', py: 'python' };

export const resolveLanguage = (language) => {
  const key = String(language || 'javascript').toLowerCase();
  return LANGUAGES[ALIASES[key] || key] ? ALIASES[key] || key : null;
};

let dockerAvailable = null;

const isDockerAvailable = async () => {
  if (dockerAvailable !== null) return dockerAvailable;
  try {
    await execFilePromise('docker', ['version', '--format', '{{.Server.Version}}'], { timeout: 5000 });
    dockerAvailable = true;
  } catch {
    dockerAvailable = false;
  }
  return dockerAvailable;
};

/** Which isolation mode to use. 'host' is only reachable outside production. */
const selectRunner = async () => {
  const configured = config.codeExecution.runner;
  if (configured === 'docker') return 'docker';
  if (configured === 'host') {
    if (config.isProduction) throw new Error('Host code execution is not permitted in production');
    return 'host';
  }
  return (await isDockerAvailable()) ? 'docker' : 'host';
};

const truncate = (value) => {
  const text = (value ?? '').toString();
  return text.length > MAX_OUTPUT_BYTES ? `${text.slice(0, MAX_OUTPUT_BYTES)}\n...[output truncated]` : text;
};

const normalize = (value) => truncate(value).replace(/\r\n/g, '\n').trim();

const dockerArgs = (spec, tempDir, containerName) => [
  'run',
  '--rm',
  '--name',
  containerName,
  // No egress: candidate code cannot call out to the network.
  '--network',
  'none',
  '--memory',
  `${config.codeExecution.memoryMb}m`,
  '--memory-swap',
  `${config.codeExecution.memoryMb}m`,
  '--cpus',
  String(config.codeExecution.cpus),
  '--pids-limit',
  '128',
  '--read-only',
  '--cap-drop',
  'ALL',
  '--security-opt',
  'no-new-privileges',
  '--user',
  '65534:65534',
  '--tmpfs',
  '/tmp:rw,size=64m,mode=1777',
  '-v',
  `${tempDir}:/app:ro`,
  '-w',
  '/app',
  spec.image,
  ...spec.command,
];

const runOnce = async ({ spec, tempDir, runner, timeoutMs }) => {
  const options = { timeout: timeoutMs, maxBuffer: MAX_OUTPUT_BYTES, killSignal: 'SIGKILL' };

  if (runner === 'docker') {
    const containerName = `coderun_${randomUUID().slice(0, 12)}`;
    try {
      return await execFilePromise('docker', dockerArgs(spec, tempDir, containerName), options);
    } catch (error) {
      // The docker CLI can be killed before the container stops.
      execFile('docker', ['rm', '-f', containerName], () => {});
      throw error;
    }
  }

  const [command, args] = spec.hostCommand(tempDir);
  return execFilePromise(command, args, options);
};

const executeTestCase = async ({ spec, code, input, expectedOutput, runner, timeoutMs }) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'coderun-'));
  const startedAt = Date.now();

  try {
    await fs.writeFile(path.join(tempDir, spec.file), spec.wrap(code), 'utf8');
    await fs.writeFile(path.join(tempDir, 'input.txt'), input || '', 'utf8');
    await fs.chmod(tempDir, 0o755);

    const { stdout, stderr } = await runOnce({ spec, tempDir, runner, timeoutMs });
    const actualOutput = normalize(stdout);

    return {
      passed: actualOutput === normalize(expectedOutput),
      actualOutput,
      error: stderr ? truncate(stderr).trim() : '',
      executionTimeMs: Date.now() - startedAt,
    };
  } catch (error) {
    const timedOut = error.killed || error.signal === 'SIGKILL' || error.code === 'ETIMEDOUT';
    return {
      passed: false,
      actualOutput: normalize(error.stdout),
      error: timedOut
        ? `Time Limit Exceeded (> ${timeoutMs}ms)`
        : truncate(error.stderr || error.message).trim() || 'Runtime Error',
      executionTimeMs: Date.now() - startedAt,
      timedOut,
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
};

const classify = (result) => {
  if (result.timedOut) return 'Time Limit Exceeded';
  if (/error:|exception|Traceback|SyntaxError/i.test(result.error || '')) return 'Runtime Error';
  return 'Wrong Answer';
};

/**
 * Execute candidate code against test cases inside a throwaway sandbox.
 * Every test case gets a fresh working directory and container.
 */
export const runCodeService = async ({ code, language, testCases = [], timeLimitMs }) => {
  if (!config.codeExecution.enabled) {
    const error = new Error('Code execution is disabled on this server');
    error.status = 503;
    error.expose = true;
    throw error;
  }

  if (typeof code !== 'string' || !code.trim()) throw new ValidationError('code is required');
  if (Buffer.byteLength(code, 'utf8') > config.codeExecution.maxCodeBytes) {
    throw new ValidationError('Submitted code exceeds the maximum allowed size');
  }

  const languageKey = resolveLanguage(language);
  if (!languageKey) throw new ValidationError(`Unsupported language: ${language}`);

  const spec = LANGUAGES[languageKey];
  const cases = testCases.slice(0, config.codeExecution.maxTestCases);
  const timeoutMs = Math.min(timeLimitMs || config.codeExecution.timeoutMs, config.codeExecution.timeoutMs);
  const runner = await selectRunner();

  if (runner === 'host') {
    logger.warn('Running candidate code without container isolation', { language: languageKey });
  }

  const results = [];
  let status = 'Accepted';
  let totalTimeMs = 0;

  for (const [index, testCase] of cases.entries()) {
    const outcome = await executeTestCase({
      spec,
      code,
      input: testCase.input || '',
      expectedOutput: testCase.expectedOutput || '',
      runner,
      timeoutMs,
    });

    totalTimeMs += outcome.executionTimeMs;
    results.push({
      testCaseId: testCase._id || `tc_${index + 1}`,
      passed: outcome.passed,
      input: testCase.input,
      expectedOutput: (testCase.expectedOutput || '').trim(),
      actualOutput: outcome.actualOutput,
      error: outcome.error,
      executionTimeMs: outcome.executionTimeMs,
    });

    if (!outcome.passed && status === 'Accepted') status = classify(outcome);
  }

  return {
    status: cases.length ? status : 'Accepted',
    passCount: results.filter((result) => result.passed).length,
    totalCount: results.length,
    executionTimeMs: results.length ? Math.round(totalTimeMs / results.length) : 0,
    runner,
    testResults: results,
  };
};
