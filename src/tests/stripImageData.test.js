import { describe, expect, it } from 'vitest';
import { isImageRelatedKey, stripImageRelatedData } from '../utils/stripImageData';

describe('stripImageData', () => {
  it('detects image-related keys', () => {
    expect(isImageRelatedKey('image_url')).toBe(true);
    expect(isImageRelatedKey('thumbnail')).toBe(true);
    expect(isImageRelatedKey('title')).toBe(false);
  });

  it('removes image-related keys recursively', () => {
    const payload = {
      id: '1',
      image_url: 'https://example.com/full.jpg',
      nested: {
        thumbnail: 'https://example.com/thumb.jpg',
        name: 'Trip'
      },
      items: [
        {
          thumbnail_url: 'https://example.com/thumb2.jpg',
          note: 'kept'
        }
      ]
    };

    expect(stripImageRelatedData(payload)).toEqual({
      id: '1',
      nested: {
        name: 'Trip'
      },
      items: [
        {
          note: 'kept'
        }
      ]
    });
  });

  it('returns primitives unchanged', () => {
    expect(stripImageRelatedData('value')).toBe('value');
    expect(stripImageRelatedData(null)).toBe(null);
  });
});
