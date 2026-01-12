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

  describe('API error handling', () => {
    it('rejects with a formatted message when API returns a standard error', async () => {
      const promise = fetchJsonp('https://example.com/data');
      const script = document.querySelector('script');
      const callbackName = new URL(script.src).searchParams.get('callback');
      const apiError = { error: { code: 404, message: 'Not Found' } };

      window[callbackName](apiError);

      await expect(promise).rejects.toThrow('API Error 404: Not Found');
    });

    it('rejects with a message when API error has no code', async () => {
      const promise = fetchJsonp('https://example.com/data');
      const script = document.querySelector('script');
      const callbackName = new URL(script.src).searchParams.get('callback');
      const apiError = { error: { message: 'Something went wrong' } };

      window[callbackName](apiError);

      await expect(promise).rejects.toThrow('API Error: Something went wrong');
    });

    it('rejects with a default message when API error has no message', async () => {
      const promise = fetchJsonp('https://example.com/data');
      const script = document.querySelector('script');
      const callbackName = new URL(script.src).searchParams.get('callback');
      const apiError = { error: { code: 500 } };

      window[callbackName](apiError);

      await expect(promise).rejects.toThrow('API Error 500: Unknown error');
    });

    it('rejects with a default message for a malformed error object', async () => {
      const promise = fetchJsonp('https://example.com/data');
      const script = document.querySelector('script');
      const callbackName = new URL(script.src).searchParams.get('callback');
      const apiError = { error: {} };

      window[callbackName](apiError);

      await expect(promise).rejects.toThrow('API Error: Unknown error');
    });
  });
});
