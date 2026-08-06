import { runPnpmScript } from '../runCommand.ts';

/**
 * Lint clientV3 then server; stop on first failure.
 *
 * @returns First non-zero exit code, or 0 when both pass
 */
export const runLint = async (): Promise<number> => {
  console.log('▶ lint — clientV3');
  const clientCode = await runPnpmScript('clientV3', 'lint');
  if (clientCode !== 0) return clientCode;

  console.log('▶ lint — server');
  return runPnpmScript('server', 'lint');
};
