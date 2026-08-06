import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import './prismPortfolio.css';
import { type ReactNode, useEffect } from 'react';

type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'heading'; level: number; text: string };

// Raw row example: "## Heading" should match the markdown heading regex.
const HEADING_PATTERN = /^(#{1,3})\s+(.+)$/;
// Raw row example: "[text](https://example.com)" should match the inline markdown regex.
const INLINE_MARKDOWN_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/**
 * Parses authored blog markdown into renderable content blocks.
 *
 * @param content - Localized blog post body.
 * @returns Ordered paragraph, heading, and fenced code blocks.
 * @example
 * parseBlocks('## Hello\\n\\nWorld')
 */
const parseBlocks = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex] ?? '';

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      lineIndex += 1;

      while (lineIndex < lines.length) {
        const codeLine = lines[lineIndex] ?? '';
        if (codeLine.startsWith('```')) {
          break;
        }
        codeLines.push(codeLine);
        lineIndex += 1;
      }

      if (lineIndex < lines.length) {
        lineIndex += 1;
      }

      blocks.push({ kind: 'code', language, code: codeLines.join('\n') });
    } else {
      const headingMatch = line.match(HEADING_PATTERN);

      if (headingMatch !== null) {
        const [, markers, headingText] = headingMatch;

        if (markers === undefined || headingText === undefined) {
          throw new Error(`Heading matched but did not parse: ${line}`);
        }

        blocks.push({ kind: 'heading', level: markers.length, text: headingText });
        lineIndex += 1;
      } else if (line.trim() === '') {
        lineIndex += 1;
      } else {
        const paragraphLines: string[] = [];

        while (lineIndex < lines.length) {
          const paragraphLine = lines[lineIndex] ?? '';
          if (
            paragraphLine.trim() === '' ||
            paragraphLine.startsWith('```') ||
            HEADING_PATTERN.test(paragraphLine)
          ) {
            break;
          }

          paragraphLines.push(paragraphLine);
          lineIndex += 1;
        }

        blocks.push({ kind: 'paragraph', text: paragraphLines.join('\n') });
      }
    }
  }

  return blocks;
};

/**
 * Renders a subset of inline markdown (links, code, bold, italic).
 *
 * @param text - Paragraph text that may include inline markdown.
 * @returns Mixed string and React nodes for the paragraph.
 * @example
 * renderInlineMarkdown('See [docs](https://example.com) and `code`.')
 */
const renderInlineMarkdown = (text: string): (string | ReactNode)[] => {
  const segments: (string | ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  INLINE_MARKDOWN_PATTERN.lastIndex = 0;

  while ((match = INLINE_MARKDOWN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index));
    }

    const [, linkLabel, linkHref, inlineCode, boldText, italicText] = match;

    if (linkLabel !== undefined && linkHref !== undefined) {
      segments.push(
        <a
          className="text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
          href={linkHref}
          key={`link-${match.index}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {linkLabel}
        </a>,
      );
    } else if (inlineCode !== undefined) {
      segments.push(
        <code
          className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[13px] text-code-foreground"
          key={`code-${match.index}`}
        >
          {inlineCode}
        </code>,
      );
    } else if (boldText !== undefined) {
      segments.push(
        <strong className="font-semibold text-[var(--text-primary)]" key={`bold-${match.index}`}>
          {boldText}
        </strong>,
      );
    } else if (italicText !== undefined) {
      segments.push(
        <em className="italic" key={`italic-${match.index}`}>
          {italicText}
        </em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
};

export const BlogContent = ({ content }: { content: string }) => {
  const blocks = parseBlocks(content);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <article className="flex flex-col gap-5 text-[15px] leading-8 text-[var(--text-secondary)] md:text-base">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading':
            if (block.level === 2) {
              return (
                <h2
                  className="mt-4 text-xl font-semibold tracking-tight text-[var(--text-primary)]"
                  key={`heading-${index}-${block.text}`}
                >
                  {block.text}
                </h2>
              );
            }

            return (
              <h3
                className="mt-2 text-lg font-semibold tracking-tight text-[var(--text-primary)]"
                key={`heading-${index}-${block.text}`}
              >
                {block.text}
              </h3>
            );

          case 'code':
            return (
              <div
                className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-code-panel"
                key={`code-${index}`}
              >
                <pre className="p-4 text-[13px] leading-6">
                  <code className={`language-${block.language}`}>{block.code}</code>
                </pre>
              </div>
            );

          case 'paragraph':
            return <p key={`paragraph-${index}`}>{renderInlineMarkdown(block.text)}</p>;

          default:
            return null;
        }
      })}
    </article>
  );
};
