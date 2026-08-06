import { runPnpmScript } from '../runCommand.ts';

/**
 * Build the living portfolio app (clientV3).
 *
 * @returns Exit code from the package build script
 */
export const runBuild = async (): Promise<number> => {
  console.log('▶ build — clientV3');
  return runPnpmScript('clientV3', 'build');
};
