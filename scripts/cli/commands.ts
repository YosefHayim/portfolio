import { runAssetsGenerate } from './commands/assets.ts';
import { runBuild } from './commands/build.ts';
import { runDeploy } from './commands/deploy.ts';
import { runDev } from './commands/dev.ts';
import { runFormat } from './commands/format.ts';
import { runLint } from './commands/lint.ts';
import { runPostNew } from './commands/post.ts';
import { runTest } from './commands/test.ts';

export type CommandHandler = (args: readonly string[]) => Promise<number>;

export type MenuCommand = {
  id: string;
  label: string;
  summary: string;
  /** Args forwarded to the shared handler (same path as flag mode). */
  invokeArgs: readonly string[];
  run: CommandHandler;
};

/**
 * Top-level verb table. Nested verbs (`post new`, `assets generate`) are parsed
 * in the entrypoint and dispatched through the same handlers as the menu.
 */
export const topLevelVerbs = {
  dev: {
    summary: 'Start clientV3 + server together',
    usage: 'dev',
    run: async () => runDev(),
  },
  build: {
    summary: 'Build clientV3',
    usage: 'build',
    run: async () => runBuild(),
  },
  deploy: {
    summary: 'Deploy with wrangler',
    usage: 'deploy',
    run: async () => runDeploy(),
  },
  lint: {
    summary: 'Lint clientV3 and server',
    usage: 'lint',
    run: async () => runLint(),
  },
  test: {
    summary: 'Test clientV3 and server',
    usage: 'test',
    run: async () => runTest(),
  },
  format: {
    summary: 'Format clientV3 and server',
    usage: 'format',
    run: async () => runFormat(),
  },
} as const;

export type TopLevelVerb = keyof typeof topLevelVerbs;

export const isTopLevelVerb = (value: string): value is TopLevelVerb =>
  Object.hasOwn(topLevelVerbs, value);

/** Interactive menu rows — both doors call these same `run` functions. */
export const menuCommands: readonly MenuCommand[] = [
  {
    id: 'dev',
    label: 'dev',
    summary: topLevelVerbs.dev.summary,
    invokeArgs: ['dev'],
    run: topLevelVerbs.dev.run,
  },
  {
    id: 'build',
    label: 'build',
    summary: topLevelVerbs.build.summary,
    invokeArgs: ['build'],
    run: topLevelVerbs.build.run,
  },
  {
    id: 'deploy',
    label: 'deploy',
    summary: topLevelVerbs.deploy.summary,
    invokeArgs: ['deploy'],
    run: topLevelVerbs.deploy.run,
  },
  {
    id: 'lint',
    label: 'lint',
    summary: topLevelVerbs.lint.summary,
    invokeArgs: ['lint'],
    run: topLevelVerbs.lint.run,
  },
  {
    id: 'test',
    label: 'test',
    summary: topLevelVerbs.test.summary,
    invokeArgs: ['test'],
    run: topLevelVerbs.test.run,
  },
  {
    id: 'format',
    label: 'format',
    summary: topLevelVerbs.format.summary,
    invokeArgs: ['format'],
    run: topLevelVerbs.format.run,
  },
  {
    id: 'post-new',
    label: 'post new',
    summary: 'Scaffold a draft blog post',
    invokeArgs: ['post', 'new'],
    // Menu collects the slug then calls runPostNew; flag path uses dispatchArgs.
    run: async (args) => runPostNew(args),
  },
  {
    id: 'assets-generate',
    label: 'assets generate',
    summary: 'Generate local assets (default: webp)',
    invokeArgs: ['assets', 'generate'],
    run: async () => runAssetsGenerate([]),
  },
];

export const printHelp = (): void => {
  console.log(`portfolio — dual-mode dev+ops CLI (ADR 0002)

Usage:
  portfolio                  Interactive menu (TTY only)
  portfolio <verb> [args]    Direct run (flags / non-TTY; never prompts)

Verbs:
  dev                         ${topLevelVerbs.dev.summary}
  build                       ${topLevelVerbs.build.summary}
  deploy                      ${topLevelVerbs.deploy.summary}
  lint                        ${topLevelVerbs.lint.summary}
  test                        ${topLevelVerbs.test.summary}
  format                      ${topLevelVerbs.format.summary}
  post new <slug-or-title>    Scaffold a draft under clientV3/src/data/drafts/
  assets generate [webp|hero|covers <id>]
                              Run asset helpers (default: webp)

Options:
  -h, --help, help            Show this help

Non-TTY bare invocation prints help and exits 1 (never hangs).
Unknown verbs print help and exit 1.
`);
};

/**
 * Dispatch argv to the shared command functions.
 *
 * @param argv - process.argv without node/script
 * @returns Exit code
 */
export const dispatchArgs = async (argv: readonly string[]): Promise<number> => {
  const [head, ...rest] = argv;

  if (head === undefined) {
    printHelp();
    return 1;
  }

  if (head === 'help' || head === '-h' || head === '--help') {
    printHelp();
    return 0;
  }

  if (head === 'post') {
    const [sub, ...postArgs] = rest;
    if (sub !== 'new') {
      console.error(`Unknown post subcommand: ${sub ?? '(none)'}`);
      printHelp();
      return 1;
    }
    return runPostNew(postArgs);
  }

  if (head === 'assets') {
    const [sub, ...assetArgs] = rest;
    if (sub !== 'generate') {
      console.error(`Unknown assets subcommand: ${sub ?? '(none)'}`);
      printHelp();
      return 1;
    }
    return runAssetsGenerate(assetArgs);
  }

  if (isTopLevelVerb(head)) {
    if (rest.length > 0) {
      console.error(`Unexpected args for ${head}: ${rest.join(' ')}`);
      printHelp();
      return 1;
    }
    return topLevelVerbs[head].run();
  }

  console.error(`Unknown verb: ${head}`);
  printHelp();
  return 1;
};
