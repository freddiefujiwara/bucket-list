import { describe, expect, it } from 'vitest';
import { isDisplayableImage } from '../utils/image';

describe('isDisplayableImage', () => {
  it('returns true for data URIs', () => {
    expect(isDisplayableImage('data:image/png;base64,abc')).toBe(true);
  });

  it('returns true for http and https URLs', () => {
    expect(isDisplayableImage('https://example.com/image.png')).toBe(true);
    expect(isDisplayableImage('http://example.com/image.png')).toBe(true);
  });

  it('returns false for other values', () => {
    expect(isDisplayableImage('data:text/plain;base64,abc')).toBe(false);
    expect(isDisplayableImage('ftp://example.com/image.png')).toBe(false);
    expect(isDisplayableImage('')).toBe(false);
    expect(isDisplayableImage(null)).toBe(false);
    expect(isDisplayableImage(undefined)).toBe(false);
  });
});
