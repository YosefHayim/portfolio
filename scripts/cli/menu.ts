import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { menuCommands } from './commands.ts';
import { runPostNew } from './commands/post.ts';

/**
 * Interactive numbered menu for a TTY. Selection runs the same handlers as flags.
 *
 * @returns Exit code from the chosen command, or 1 on cancel/invalid
 */
export const runMenu = async (): Promise<number> => {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('portfolio CLI — pick a command\n');

    for (const [index, command] of menuCommands.entries()) {
      console.log(`  ${index + 1}. ${command.label.padEnd(18)} ${command.summary}`);
    }
    console.log('  0. exit\n');

    const answer = (await rl.question('> ')).trim();
    if (answer === '' || answer === '0' || answer.toLowerCase() === 'q') {
      console.log('bye');
      return 0;
    }

    const choice = Number.parseInt(answer, 10);
    if (!Number.isFinite(choice) || choice < 1 || choice > menuCommands.length) {
      console.error(`Invalid choice: ${answer}`);
      return 1;
    }

    const selected = menuCommands[choice - 1];
    if (selected === undefined) {
      console.error(`Invalid choice: ${answer}`);
      return 1;
    }

    console.log(`→ ${selected.label}`);

    // post new needs a slug; only the TTY menu may prompt (flag mode never does).
    if (selected.id === 'post-new') {
      const slugOrTitle = (await rl.question('slug or title: ')).trim();
      return runPostNew([slugOrTitle]);
    }

    return selected.run([]);
  } finally {
    rl.close();
  }
};
