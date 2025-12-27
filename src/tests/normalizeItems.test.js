import { describe, expect, it } from 'vitest';
import { normalizeItems } from '../utils/normalizeItems';

describe('normalizeItems', () => {
  it('normalizes array payloads', () => {
    const result = normalizeItems([
      {
        id: 'a1',
        title: 'Tokyo',
        note: 'Visit',
        image_url: 'img.jpg',
        link: 'https://example.com'
      }
    ]);

    expect(result).toEqual([
      {
        id: 'a1',
        title: 'Tokyo',
        note: 'Visit',
        imageUrl: 'img.jpg',
        link: 'https://example.com'
      }
    ]);
  });

  it('handles wrapped payloads and fallback fields', () => {
    const result = normalizeItems({
      items: [
        {
          name: 'Kyoto',
          detail: 'Temple',
          photo: 'photo.png',
          url: 'https://kyoto.jp',
          image_url: 'preferred.png'
        }
      ]
    });

    expect(result[0]).toMatchObject({
      title: 'Kyoto',
      note: 'Temple',
      imageUrl: 'preferred.png',
      link: 'https://kyoto.jp'
    });
  });

  it('returns empty array when payload is missing', () => {
    expect(normalizeItems(null)).toEqual([]);
    expect(normalizeItems({ data: [] })).toEqual([]);
  });

  it('uses fallback ids and titles', () => {
    const result = normalizeItems([{ notes: 'memo' }]);

    expect(result[0].id).toBe('idx-0');
    expect(result[0].title).toBe('');
    expect(result[0].note).toBe('memo');
  });

  it('maps completed fields', () => {
    const result = normalizeItems([{ completed: true, completed_at: '2024-01-01' }]);

    expect(result[0].completed).toBe(true);
    expect(result[0].completedAt).toBe('2024-01-01');
  });
});
