import { describe, expect, it } from 'vitest';
import { formatDate, formatTargetAge } from '../utils/formatters';

describe('formatDate', () => {
  it('formats ISO date strings using UTC parts', () => {
    const input = '2023-11-12T15:00:00.000Z';

    expect(formatDate(input)).toBe('2023年11月12日');
  });

  it('returns the original value for invalid dates', () => {
    const input = 'invalid-date';

    expect(formatDate(input)).toBe('invalid-date');
  });
});

describe('formatTargetAge', () => {
  it('formats numeric ages as decades', () => {
    expect(formatTargetAge(30)).toBe('目標: 30歳台');
    expect(formatTargetAge('40')).toBe('目標: 40歳台');
  });

  it('passes through non-numeric ages', () => {
    expect(formatTargetAge('Kids')).toBe('目標: Kids');
  });
});
