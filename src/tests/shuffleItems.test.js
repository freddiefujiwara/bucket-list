import { describe, expect, it } from 'vitest';
import { shuffleItems } from '../utils/shuffleItems';

describe('shuffleItems', () => {
  it('shuffles items with a deterministic rng', () => {
    const rngValues = [0.9, 0.1, 0.7];
    let call = 0;
    const rng = () => rngValues[call++ % rngValues.length];

    const result = shuffleItems(['a', 'b', 'c', 'd'], rng);

    expect(result).toEqual(['c', 'b', 'a', 'd']);
  });

  it('does not mutate the original array', () => {
    const original = ['x', 'y'];
    const result = shuffleItems(original, () => 0);

    expect(result).toEqual(['y', 'x']);
    expect(original).toEqual(['x', 'y']);
  });
});
