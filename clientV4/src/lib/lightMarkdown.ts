// Raw row example: "**bold**" → strong tag.
const BOLD_PATTERN = /\*\*(.*?)\*\*/g;
// Raw row example: "`code`" → inline code tag.
const CODE_PATTERN = /`([^`]+)`/g;
// Raw row example: "[label](https://example.com)" → external link.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Returns an http(s) URL for a markdown link target, or null if unsafe.
 *
 * @param href - Raw link target from markdown.
 * @returns Safe absolute http(s) URL or null.
 * @example
 * // Raw row example: "https://example.com" → "https://example.com"
 * // Raw row example: "javascript:alert(1)" → null
 */
const safeHttpHref = (href: string): string | null => {
  const trimmed = href.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
};

/**
 * Light markdown → safe HTML for assistant bubbles (bold, code, links only).
 *
 * @param text - Assistant message text.
 * @returns HTML string for dangerouslySetInnerHTML.
 * @example
 * renderLightMarkdown('See **docs** at [site](https://example.com)')
 */
export const renderLightMarkdown = (text: string): string => {
  const escaped = escapeHtml(text);
  return escaped
    .replace(BOLD_PATTERN, '<strong class="font-semibold text-white">$1</strong>')
    .replace(
      CODE_PATTERN,
      '<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-mint">$1</code>',
    )
    .replace(LINK_PATTERN, (_match, label: string, href: string) => {
      const safeHref = safeHttpHref(href);
      if (!safeHref) {
        return label;
      }
      return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer" class="text-mint underline-offset-2 hover:underline">${label}</a>`;
    })
    // Raw row example: "line1\nline2" → "line1<br />line2".
    .replace(/\n/g, '<br />');
};
