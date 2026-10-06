import { describe, expect, it } from 'vitest';
import { nextScenario, scenarios } from './scenarios';

describe('scenario shuffle bag', () => {
  it('visits every scenario without repeats before refilling', () => {
    const state = { current: 'launch', remaining: scenarios.en.map((scenario) => scenario.id) };
    const seen = new Set([state.current]);
    for (const random of [0.2, 0.7, 0.1, 0.9, 0.4, 0.6, 0.3]) {
      const next = nextScenario(state.remaining, state.current, random);
      expect(seen.has(next.selected)).toBe(false);
      seen.add(next.selected);
      state.current = next.selected;
      state.remaining = next.remaining;
    }
    expect(seen.size).toBe(8);
    const refill = nextScenario(state.remaining, state.current, 0.5);
    expect(refill.selected).not.toBe(state.current);
  });
  it('uses the random sample and handles a manual selection', () => {
    const first = nextScenario([], 'launch', 0);
    const last = nextScenario([], 'launch', 0.999);
    expect(first.selected).not.toBe(last.selected);
    expect(nextScenario(['launch'], 'launch', 0).selected).not.toBe('launch');
  });
  it('keeps the same eight situations in both languages', () => {
    const englishIds = scenarios.en.map((scenario) => scenario.id);
    const hebrewIds = scenarios.he.map((scenario) => scenario.id);
    expect(englishIds).toEqual(hebrewIds);
    expect(englishIds).toHaveLength(8);
  });
});
