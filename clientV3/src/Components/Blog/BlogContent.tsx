import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import './prismPortfolio.css';
import { type ReactNode, useEffect } from 'react';

type BlogContentProps = {
  content: string;
};

type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'heading'; level: number; text: string };

// Raw row example: "## Heading" should match the markdown heading regex.
const HEADING_PATTERN = /^(#{1,3})\s+(.+)$/;
// Raw row example: "[text](https://example.com)" should match the inline markdown regex.
const INLINE_MARKDOWN_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

const parseBlocks = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ kind: 'code', language, code: codeLines.join('\n') });
    } else if (HEADING_PATTERN.test(line)) {
      // Heading
      const headingMatch = line.match(HEADING_PATTERN);
      if (headingMatch === null) {
        throw new Error(`Heading matched but did not parse: ${line}`);
      }
      blocks.push({ kind: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
    } else if (line.trim() === '') {
      // Empty line — skip
      i++;
    } else {
      // Paragraph — collect consecutive non-empty, non-special lines
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('```') &&
        !HEADING_PATTERN.test(lines[i])
      ) {
        paragraphLines.push(lines[i]);
        i++;
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
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Link
      parts.push(
        <a
          className="text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
          href={match[2]}
          key={`link-${match.index}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[13px] text-code-foreground"
          key={`code-${match.index}`}
        >
          {match[3]}
        </code>,
      );
    } else if (match[4]) {
      // Bold
      parts.push(
        <strong className="font-semibold text-[var(--text-primary)]" key={`bold-${match.index}`}>
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      // Italic
      parts.push(
        <em className="italic" key={`italic-${match.index}`}>
          {match[5]}
        </em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export const BlogContent = ({ content }: BlogContentProps) => {
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
                  key={index}
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3
                className="mt-2 text-lg font-semibold tracking-tight text-[var(--text-primary)]"
                key={index}
              >
                {block.text}
              </h3>
            );

          case 'code':
            return (
              <div
                className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-code-panel"
                key={index}
              >
                <pre className="p-4 text-[13px] leading-6">
                  <code className={`language-${block.language}`}>{block.code}</code>
                </pre>
              </div>
            );

          case 'paragraph':
            return <p key={index}>{renderInlineMarkdown(block.text)}</p>;

          default:
            return null;
        }
      })}
    </article>
  );
};
