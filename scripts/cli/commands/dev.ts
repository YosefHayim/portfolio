import { spawn } from 'node:child_process';
import path from 'node:path';
import { repoRoot, waitForFirstExit } from '../runCommand.ts';

/**
 * Start clientV3 and server dev servers together.
 *
 * @returns Exit code of the first process to exit
 */
export const runDev = async (): Promise<number> => {
  console.log('▶ dev — clientV3 + server');

  const client = spawn('pnpm', ['dev'], {
    cwd: path.join(repoRoot, 'clientV3'),
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  const server = spawn('pnpm', ['dev'], {
    cwd: path.join(repoRoot, 'server'),
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return waitForFirstExit([client, server]);
};
