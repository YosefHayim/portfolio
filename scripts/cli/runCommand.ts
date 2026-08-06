import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repo root: scripts/cli/ → scripts/ → portfolio/ */
export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export type RunOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
};

/**
 * Spawn a process with inherited stdio; resolve with the exit code.
 *
 * @param command - Executable name or path
 * @param args - Argument list
 * @param options - Optional cwd/env overrides
 * @returns Exit code (1 when the child closes without a code)
 * @example
 * await runCommand('pnpm', ['lint'], { cwd: path.join(repoRoot, 'clientV3') });
 */
export const runCommand = (
  command: string,
  args: readonly string[],
  options: RunOptions = {},
): Promise<number> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, [...args], {
      cwd: options.cwd ?? repoRoot,
      env: { ...process.env, ...options.env },
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      resolve(code ?? 1);
    });
  });

/**
 * Run `pnpm <script>` inside a package directory under the repo root.
 *
 * @param packageDir - Package folder name relative to repo root (e.g. `clientV3`)
 * @param scriptName - package.json script key
 * @param extraArgs - Args after `--`
 * @returns Exit code
 */
export const runPnpmScript = (
  packageDir: string,
  scriptName: string,
  extraArgs: readonly string[] = [],
): Promise<number> => {
  const args =
    extraArgs.length === 0
      ? [scriptName]
      : [scriptName, '--', ...extraArgs];

  return runCommand('pnpm', args, {
    cwd: path.join(repoRoot, packageDir),
  });
};

/**
 * Run several long-lived processes until the first exits; forward SIGINT/SIGTERM.
 *
 * @param children - Already-spawned children with inherited stdio
 * @returns Exit code of the first process to close
 */
export const waitForFirstExit = (children: readonly ChildProcess[]): Promise<number> =>
  new Promise((resolve) => {
    let settled = false;

    const shutdown = (signal: NodeJS.Signals) => {
      for (const child of children) {
        if (!child.killed) {
          child.kill(signal);
        }
      }
    };

    const onSignal = (signal: NodeJS.Signals) => {
      shutdown(signal);
    };

    process.once('SIGINT', () => onSignal('SIGINT'));
    process.once('SIGTERM', () => onSignal('SIGTERM'));

    for (const child of children) {
      child.on('error', (error) => {
        if (settled) return;
        settled = true;
        console.error(error);
        shutdown('SIGTERM');
        resolve(1);
      });

      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        shutdown('SIGTERM');
        resolve(code ?? 1);
      });
    }
  });
