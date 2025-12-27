import { describe, expect, it } from 'vitest';
import { normalizeItems } from '../utils/normalizeItems';

describe('normalizeItems', () => {
  it('normalizes array payloads', () => {
    const result = normalizeItems([
      {
        id: 'a1',
        category: 'Travel',
        target_age: 'Adult',
        title: 'Tokyo',
        note: 'Visit',
        image_url: 'img.jpg',
        completed: true,
        completed_at: '2024-01-01'
      }
    ]);

    expect(result).toEqual([
      {
        id: 'a1',
        category: 'Travel',
        targetAge: 'Adult',
        title: 'Tokyo',
        note: 'Visit',
        imageUrl: 'img.jpg',
        completed: true,
        completedAt: '2024-01-01'
      }
    ]);
  });

  it('returns empty array when payload is missing', () => {
    expect(normalizeItems(null)).toEqual([]);
    expect(normalizeItems({ data: [] })).toEqual([]);
  });

  it('uses fallback ids and empty defaults', () => {
    const result = normalizeItems([{}]);

    expect(result[0].id).toBe('idx-0');
    expect(result[0].title).toBe('');
    expect(result[0].note).toBe('');
    expect(result[0].imageUrl).toBe('');
    expect(result[0].completed).toBe(false);
    expect(result[0].completedAt).toBe('');
    expect(result[0].category).toBe('');
    expect(result[0].targetAge).toBe('');
  });
});
