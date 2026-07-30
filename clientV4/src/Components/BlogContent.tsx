import type { ReactNode } from 'react';

type BlogContentProps = {
  content: string;
};

type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'heading'; level: number; text: string };

// Raw row example: "## The try/catch noise is over" → level "##", text "The try/catch…".
const HEADING_PATTERN = /^(#{1,3})\s+(.+)$/;
// Raw row example: "[Effect](https://example.com)" | "`code`" | "**bold**" | "*italic*"
const INLINE_MARKDOWN_PATTERN =
  /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

const parseBlocks = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i += 1;
      }
      i += 1;
      blocks.push({ kind: 'code', language, code: codeLines.join('\n') });
    } else if (HEADING_PATTERN.test(line)) {
      const headingMatch = line.match(HEADING_PATTERN);
      if (headingMatch?.[1] && headingMatch[2]) {
        blocks.push({
          kind: 'heading',
          level: headingMatch[1].length,
          text: headingMatch[2],
        });
      }
      i += 1;
    } else if (line.trim() === '') {
      i += 1;
    } else {
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        (lines[i] ?? '').trim() !== '' &&
        !(lines[i] ?? '').startsWith('```') &&
        !HEADING_PATTERN.test(lines[i] ?? '')
      ) {
        paragraphLines.push(lines[i] ?? '');
        i += 1;
      }
      blocks.push({ kind: 'paragraph', text: paragraphLines.join('\n') });
    }
  }

  return blocks;
};

const renderInlineMarkdown = (text: string): (string | ReactNode)[] => {
  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_MARKDOWN_PATTERN.lastIndex = 0;

  while ((match = INLINE_MARKDOWN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      parts.push(
        <a
          className="text-mint underline decoration-mint/30 underline-offset-2 transition hover:decoration-mint"
          href={match[2]}
          key={`link-${match.index}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      parts.push(
        <code
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-mint"
          key={`code-${match.index}`}
        >
          {match[3]}
        </code>,
      );
    } else if (match[4]) {
      parts.push(
        <strong className="font-semibold text-white" key={`bold-${match.index}`}>
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      parts.push(
        <em className="italic text-zinc-300" key={`em-${match.index}`}>
          {match[5]}
        </em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

/**
 * Lightweight markdown renderer for journal notes (headings, code, links).
 *
 * @param content - Author markdown body.
 * @returns Styled article blocks.
 * @example
 * <BlogContent content={post.content} />
 */
export const BlogContent = ({ content }: BlogContentProps) => {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-zinc-300 sm:text-base">
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          if (block.level === 1) {
            return (
              <h2
                className="pt-4 text-2xl font-semibold tracking-tight text-white"
                key={`h-${index}`}
              >
                {block.text}
              </h2>
            );
          }
          if (block.level === 2) {
            return (
              <h3
                className="pt-3 text-xl font-semibold tracking-tight text-white"
                key={`h-${index}`}
              >
                {block.text}
              </h3>
            );
          }
          return (
            <h4
              className="pt-2 text-lg font-medium tracking-tight text-white"
              key={`h-${index}`}
            >
              {block.text}
            </h4>
          );
        }

        if (block.kind === 'code') {
          return (
            <pre
              className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-zinc-200"
              key={`c-${index}`}
            >
              <code data-language={block.language}>{block.code}</code>
            </pre>
          );
        }

        return (
          <p className="whitespace-pre-wrap" key={`p-${index}`}>
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
};
