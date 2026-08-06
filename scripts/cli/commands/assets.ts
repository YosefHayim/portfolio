import path from 'node:path';
import { repoRoot, runCommand } from '../runCommand.ts';

/**
 * Run local asset generation helpers.
 *
 * - bare / default → clientV4 WebP conversion
 * - `hero` → scripts/generateHero.sh
 * - `covers <conversationId>` → scripts/generateBlogCovers.sh
 *
 * Never prompts; missing required args fail with usage (non-TTY safe).
 *
 * @param args - Optional generator selector and args
 * @returns Exit code from the helper process
 */
export const runAssetsGenerate = async (args: readonly string[]): Promise<number> => {
  const kind = args[0] ?? 'webp';

  switch (kind) {
    case 'webp': {
      console.log('▶ assets generate — convertV4ImagesToWebp');
      return runCommand('node', [path.join(repoRoot, 'scripts/dev/convertV4ImagesToWebp.mjs')]);
    }
    case 'hero': {
      console.log('▶ assets generate — generateHero.sh');
      return runCommand('bash', [path.join(repoRoot, 'scripts/generateHero.sh')]);
    }
    case 'covers': {
      const conversationId = args[1];
      if (conversationId === undefined || conversationId.trim() === '') {
        console.error('Usage: portfolio assets generate covers <conversationIdOrUrl>');
        return 1;
      }
      console.log('▶ assets generate — generateBlogCovers.sh');
      return runCommand('bash', [
        path.join(repoRoot, 'scripts/generateBlogCovers.sh'),
        conversationId,
      ]);
    }
    default: {
      console.error(
        `Unknown assets target "${kind}". Use: webp | hero | covers <conversationId>`,
      );
      return 1;
    }
  }
};
