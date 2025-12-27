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

  it('returns empty array when payload is missing', () => {
    expect(normalizeItems(null)).toEqual([]);
    expect(normalizeItems({ data: [] })).toEqual([]);
  });

  it('uses fallback ids and titles', () => {
    const result = normalizeItems([{ notes: 'memo' }]);

    expect(result[0].id).toContain('Item 1');
    expect(result[0].title).toBe('Item 1');
  });
});
