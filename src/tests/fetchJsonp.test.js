import { describe, expect, it } from 'vitest';
import { buildJsonpUrl, fetchJsonp } from '../services/fetchJsonp';

describe('buildJsonpUrl', () => {
  it('replaces existing callback parameters', () => {
    const url = buildJsonpUrl('https://example.com/data?callback=func', 'callback', 'next');
    const parsed = new URL(url);

    expect(parsed.searchParams.get('callback')).toBe('next');
  });

  it('appends callback parameter when missing', () => {
    const url = buildJsonpUrl('https://example.com/data', 'cb', 'handler');
    const parsed = new URL(url);

    expect(parsed.searchParams.get('cb')).toBe('handler');
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

  it('rejects when script fails to load', async () => {
    const promise = fetchJsonp('https://example.com/data?callback=func', { timeout: 2000 });
    const script = document.querySelector('script');

    script.dispatchEvent(new Event('error'));

    await expect(promise).rejects.toThrow('JSONPの読み込みに失敗しました');
  });

  it('rejects on timeout', async () => {
    const promise = fetchJsonp('https://example.com/data?callback=func', { timeout: 0 });

    await expect(promise).rejects.toThrow('JSONPのタイムアウトが発生しました');
  });
});
