import { describe, expect, it } from 'vitest';
import { problemCount } from './problemRotation';
import { problemsText } from './problems.text';

describe('problems text', () => {
  it('has one title, subtitle and fix per problem in both languages', () => {
    const languages = Object.values(problemsText);
    languages.forEach((text) => {
      expect(text.problems).toHaveLength(problemCount);
      text.problems.forEach((problem) => {
        expect(problem.title).not.toBe('');
        expect(problem.subtitle).not.toBe('');
        expect(problem.fix).not.toBe('');
      });
    });
  });
});
