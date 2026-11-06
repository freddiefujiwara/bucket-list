import { describe, expect, it } from 'vitest';
import {
  buildShareUrl,
  formatShareExpiry,
  formatShareRemaining,
  parseShareToken,
  shareSecondsLeft
} from '../utils/share';

describe('share helpers', () => {
  it('parses the share token from a hash', () => {
    expect(parseShareToken('#share=abc123')).toBe('abc123');
    expect(parseShareToken('share=abc123')).toBe('abc123');
    expect(parseShareToken('#foo=1&share=tok%20en')).toBe('tok en');
    expect(parseShareToken('#foo=1')).toBe('');
    expect(parseShareToken('')).toBe('');
    expect(parseShareToken(null)).toBe('');
  });

  it('builds a share url with an encoded token', () => {
    expect(buildShareUrl('https://example.com/app/', 'a b')).toBe(
      'https://example.com/app/#share=a%20b'
    );
  });

  it('computes seconds left until expiry', () => {
    const now = Date.parse('2026-11-07T00:00:00.000Z');
    expect(shareSecondsLeft('2026-11-08T00:00:00.000Z', now)).toBe(86400);
    expect(shareSecondsLeft('2026-11-06T00:00:00.000Z', now)).toBe(0);
    expect(shareSecondsLeft('not-a-date', now)).toBe(null);
  });

  it('formats the expiry label', () => {
    expect(formatShareExpiry('not-a-date')).toBe('');
    const label = formatShareExpiry('2026-12-02T07:56:00.000Z');
    expect(label).toMatch(/^20261202 \d{2}:\d{2}$/);
  });

  it('formats the remaining label', () => {
    expect(formatShareRemaining(null)).toBe('');
    expect(formatShareRemaining(0)).toBe('期限切れ');
    expect(formatShareRemaining(30)).toBe('残り約1分未満');
    expect(formatShareRemaining(600)).toBe('残り約10分');
    expect(formatShareRemaining(7200)).toBe('残り約2時間');
    expect(formatShareRemaining(86400 * 30)).toBe('残り約30日');
  });
});
