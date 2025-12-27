import { describe, expect, it } from 'vitest';
import { normalizeItems } from '../utils/normalizeItems';

describe('normalizeItems', () => {
  it('normalizes array payloads', () => {
    const result = normalizeItems([
      { id: 'a1', title: 'Tokyo', description: 'Visit', image: 'img.jpg', link: 'https://example.com' }
    ]);

    expect(result).toEqual([
      {
        id: 'a1',
        title: 'Tokyo',
        description: 'Visit',
        imageUrl: 'img.jpg',
        link: 'https://example.com'
      }
    ]);
  });

  it('handles wrapped payloads and fallback fields', () => {
    const result = normalizeItems({
      items: [{ name: 'Kyoto', detail: 'Temple', photo: 'photo.png', url: 'https://kyoto.jp' }]
    });

    expect(result[0]).toMatchObject({
      title: 'Kyoto',
      description: 'Temple',
      imageUrl: 'photo.png',
      link: 'https://kyoto.jp'
    });
  });
});
