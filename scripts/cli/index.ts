#!/usr/bin/env node
/**
 * Dual-mode portfolio CLI (ADR 0002).
 *
 * - Bare TTY → interactive menu
 * - Flags / non-TTY → direct run; never hangs waiting on input
 * - Both doors call the same command functions
 */
import { dispatchArgs, printHelp } from './commands.ts';
import { runMenu } from './menu.ts';

const isInteractiveTty = (): boolean =>
  Boolean(process.stdin.isTTY && process.stdout.isTTY);

/** Drop a leading `--` that package runners sometimes forward (e.g. `pnpm run cli -- --help`). */
const scriptArgs = (): string[] => {
  const raw = process.argv.slice(2);
  if (raw[0] === '--') {
    return raw.slice(1);
  }
  return raw;
};

const main = async (): Promise<number> => {
  const argv = scriptArgs();

  if (argv.length === 0) {
    if (isInteractiveTty()) {
      return runMenu();
    }
    // Non-TTY bare invoke must not hang on a prompt.
    printHelp();
    return 1;
  }

  return dispatchArgs(argv);
};

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
