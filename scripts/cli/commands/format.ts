import { runPnpmScript } from '../runCommand.ts';

/**
 * Format clientV3 then server sources.
 *
 * @returns First non-zero exit code, or 0 when both pass
 */
export const runFormat = async (): Promise<number> => {
  console.log('▶ format — clientV3');
  const clientCode = await runPnpmScript('clientV3', 'format');
  if (clientCode !== 0) return clientCode;

  console.log('▶ format — server');
  return runPnpmScript('server', 'format');
};
