import { describe, expect, it } from '@effect/vitest';
import {
  AI_CHAT_MAX_TOKENS,
  AI_CHAT_MODEL,
  AI_CHAT_TEMPERATURE,
  canUseAssistantResponseCache,
  createCachedResponseChunks,
  getLastUserMessage,
  hasDynamicPortfolioIntent,
  shouldBypassAssistantCache,
} from './assistant.js';

describe('assistant pure helpers', () => {
  it('exposes the chat model defaults used by the provider input', () => {
    expect(AI_CHAT_MODEL).toBe('gpt-4o-mini');
    expect(AI_CHAT_MAX_TOKENS).toBe(400);
    expect(AI_CHAT_TEMPERATURE).toBe(0.7);
  });

  it('returns the last message content or empty string', () => {
    expect(getLastUserMessage([])).toBe('');
    expect(
      getLastUserMessage([
        { role: 'user', content: 'first' },
        { role: 'assistant', content: 'second' },
        { role: 'user', content: 'third' },
      ]),
    ).toBe('third');
  });

  it('detects dynamic portfolio intent keywords case-insensitively', () => {
    expect(hasDynamicPortfolioIntent('Show me your latest GitHub projects')).toBe(true);
    expect(hasDynamicPortfolioIntent('any RECENT repos?')).toBe(true);
    expect(hasDynamicPortfolioIntent('newest updated work')).toBe(true);
    expect(hasDynamicPortfolioIntent('What are your skills?')).toBe(false);
    expect(hasDynamicPortfolioIntent('Tell me about yourself')).toBe(false);
  });

  it('bypasses cache only when the last user message is dynamic', () => {
    expect(
      shouldBypassAssistantCache([{ role: 'user', content: 'latest github projects' }]),
    ).toBe(true);
    expect(shouldBypassAssistantCache([{ role: 'user', content: 'skills list' }])).toBe(false);
  });

  it('allows response cache only for single-turn non-dynamic chats', () => {
    expect(canUseAssistantResponseCache([{ role: 'user', content: 'skills?' }])).toBe(true);
    expect(
      canUseAssistantResponseCache([
        { role: 'user', content: 'skills?' },
        { role: 'assistant', content: 'TS' },
        { role: 'user', content: 'more?' },
      ]),
    ).toBe(false);
    expect(
      canUseAssistantResponseCache([{ role: 'user', content: 'latest github projects' }]),
    ).toBe(false);
  });

  it('chunks cached replies into groups of three words with trailing spaces', () => {
    expect(createCachedResponseChunks('one two three four five six seven')).toEqual([
      'one two three ',
      'four five six ',
      'seven',
    ]);
    expect(createCachedResponseChunks('only')).toEqual(['only']);
    expect(createCachedResponseChunks('a b')).toEqual(['a b']);
    expect(createCachedResponseChunks('')).toEqual(['']);
  });
});
