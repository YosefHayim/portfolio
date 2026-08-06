import { runPnpmScript } from '../runCommand.ts';

/**
 * Run clientV3 then server tests; stop on first failure.
 *
 * @returns First non-zero exit code, or 0 when both pass
 */
export const runTest = async (): Promise<number> => {
  console.log('▶ test — clientV3');
  const clientCode = await runPnpmScript('clientV3', 'test');
  if (clientCode !== 0) return clientCode;

  console.log('▶ test — server');
  return runPnpmScript('server', 'test');
};
