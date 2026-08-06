import { runCommand } from '../runCommand.ts';

/**
 * Deploy the unified worker (expects dist/ already built when required).
 *
 * @returns Exit code from wrangler
 */
export const runDeploy = async (): Promise<number> => {
  console.log('▶ deploy — wrangler deploy');
  return runCommand('pnpm', ['exec', 'wrangler', 'deploy']);
};
