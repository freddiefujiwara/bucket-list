import { describe, expect, it } from 'vitest';
import { buildJsonpUrl, fetchJsonp } from '../services/fetchJsonp';

describe('buildJsonpUrl', () => {
  it('replaces existing callback parameters', () => {
    const url = buildJsonpUrl('https://example.com/data?callback=func', 'callback', 'next');
    const parsed = new URL(url);

    expect(parsed.searchParams.get('callback')).toBe('next');
  });
});

describe('fetchJsonp', () => {
  it('resolves with data from the callback', async () => {
    const promise = fetchJsonp('https://example.com/data?callback=func', { timeout: 2000 });
    const script = document.querySelector('script');
    const callbackName = new URL(script.src).searchParams.get('callback');

    window[callbackName]({ message: 'ok' });

    await expect(promise).resolves.toEqual({ message: 'ok' });
    expect(document.querySelector('script')).toBeNull();
  });
});
