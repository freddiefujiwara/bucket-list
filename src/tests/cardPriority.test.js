import { describe, expect, it } from 'vitest';
import { getCardClasses } from '../utils/cardPriority';

const fixedNow = new Date('2024-09-03T12:00:00.000Z');

describe('getCardClasses', () => {
  it('returns completed class when item is completed', () => {
    expect(getCardClasses({ completed: true }, fixedNow)).toEqual({ completed: true });
  });

  it('returns low priority for invalid target age', () => {
    expect(getCardClasses({ targetAge: 'invalid' }, fixedNow)).toEqual({ 'priority-low': true });
    expect(getCardClasses({}, fixedNow)).toEqual({ 'priority-low': true });
  });

  it('returns high priority when target age is behind current decade', () => {
    expect(getCardClasses({ targetAge: 30 }, fixedNow)).toEqual({ 'priority-high': true });
  });

  it('returns mid priority when target age is within next decade', () => {
    expect(getCardClasses({ targetAge: 50 }, fixedNow)).toEqual({ 'priority-mid': true });
  });

  it('returns low priority for ages beyond the next decade', () => {
    expect(getCardClasses({ targetAge: 70 }, fixedNow)).toEqual({ 'priority-low': true });
  });
});
