// Raw row example: "**bold**" → strong tag.
const BOLD_PATTERN = /\*\*(.*?)\*\*/g;
// Raw row example: "`code`" → inline code tag.
const CODE_PATTERN = /`([^`]+)`/g;
// Raw row example: "[label](https://example.com)" → external link.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Light markdown → safe HTML for assistant bubbles (bold, code, links only).
 *
 * @param text - Assistant message text.
 * @returns HTML string for dangerouslySetInnerHTML.
 * @example
 * renderLightMarkdown('See **docs** at [site](https://example.com)')
 */
export const renderLightMarkdown = (text: string): string =>
  text
    // Raw row example: "Tom & Jerry" → "Tom &amp; Jerry" before markdown tags.
    .replace(/&/g, '&amp;')
    // Raw row example: "<tag>" escapes the opening angle bracket.
    .replace(/</g, '&lt;')
    // Raw row example: "<tag>" escapes the closing angle bracket.
    .replace(/>/g, '&gt;')
    .replace(BOLD_PATTERN, '<strong class="font-semibold text-white">$1</strong>')
    .replace(
      CODE_PATTERN,
      '<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-mint">$1</code>',
    )
    .replace(
      LINK_PATTERN,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-mint underline-offset-2 hover:underline">$1</a>',
    )
    // Raw row example: "line1\nline2" → "line1<br />line2".
    .replace(/\n/g, '<br />');
