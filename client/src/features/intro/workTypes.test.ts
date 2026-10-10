import { describe, expect, it } from 'vitest';
import { firstWorkType, nextWorkType } from './workTypes';

describe('work types', () => {
  it('starts with websites', () => {
    expect(firstWorkType).toBe('website');
  });

  it('moves through every work type in order, then back to the first', () => {
    expect(nextWorkType('website')).toBe('app');
    expect(nextWorkType('app')).toBe('automation');
    expect(nextWorkType('automation')).toBe('aiTool');
    expect(nextWorkType('aiTool')).toBe('extension');
    expect(nextWorkType('extension')).toBe('website');
  });
});
