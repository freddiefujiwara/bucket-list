import { describe, expect, it } from 'vitest';
import { isDataImage } from '../utils/image';

describe('isDataImage', () => {
  it('returns true for data URIs', () => {
    expect(isDataImage('data:image/png;base64,abc')).toBe(true);
  });

  it('returns false for non-data values', () => {
    expect(isDataImage('https://example.com/image.png')).toBe(false);
    expect(isDataImage('')).toBe(false);
    expect(isDataImage(null)).toBe(false);
  });
});
