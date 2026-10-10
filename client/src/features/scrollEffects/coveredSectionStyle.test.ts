import { describe, expect, it } from 'vitest';
import { coveredProgress, coveredSectionStyle, stickyTop } from './coveredSectionStyle';

describe('covered section style', () => {
  it('sticks short sections 8px from the top and tall ones by their bottom edge', () => {
    expect(stickyTop(900, 600)).toBe(8);
    expect(stickyTop(900, 1200)).toBe(-308);
  });

  it('measures how far the next section has covered this one', () => {
    expect(coveredProgress(900, 900)).toBe(0);
    expect(coveredProgress(900, 454)).toBe(0.5);
    expect(coveredProgress(900, 8)).toBe(1);
    expect(coveredProgress(900, -200)).toBe(1);
    expect(coveredProgress(900, 1400)).toBe(0);
  });

  it('shrinks and dims a covered section', () => {
    expect(coveredSectionStyle(1, 900, 8, false)).toEqual({
      transform: 'scale(0.9500)',
      transformOrigin: '50% 442px',
      coverDim: '0.300',
    });
  });

  it('leaves an uncovered section untouched', () => {
    expect(coveredSectionStyle(0, 900, 8, false).transform).toBe('');
  });

  it('only dims when the visitor prefers reduced motion', () => {
    expect(coveredSectionStyle(1, 900, 8, true)).toEqual({
      transform: '',
      transformOrigin: '',
      coverDim: '0.250',
    });
  });
});
