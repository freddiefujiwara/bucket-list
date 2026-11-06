import { describe, expect, it, vi } from 'vitest';
import { THEME_KEY, applyTheme, nextTheme, resolveTheme } from '../utils/theme';

describe('theme', () => {
  it('exposes the storage key', () => {
    expect(THEME_KEY).toBe('bucket-list-theme');
  });

  describe('resolveTheme', () => {
    it('returns light only for the stored light value', () => {
      expect(resolveTheme('light')).toBe('light');
    });

    it('falls back to dark for anything else', () => {
      expect(resolveTheme('dark')).toBe('dark');
      expect(resolveTheme('')).toBe('dark');
      expect(resolveTheme(null)).toBe('dark');
      expect(resolveTheme(undefined)).toBe('dark');
    });
  });

  describe('nextTheme', () => {
    it('toggles between light and dark', () => {
      expect(nextTheme('light')).toBe('dark');
      expect(nextTheme('dark')).toBe('light');
    });
  });

  describe('applyTheme', () => {
    const makeRoot = () => ({
      setAttribute: vi.fn(),
      removeAttribute: vi.fn()
    });

    it('sets data-theme and shows the dark label for light theme', () => {
      const root = makeRoot();
      const button = { textContent: '' };

      applyTheme(root, button, 'light');

      expect(root.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      expect(root.removeAttribute).not.toHaveBeenCalled();
      expect(button.textContent).toBe('ダーク');
    });

    it('removes data-theme and shows the light label for dark theme', () => {
      const root = makeRoot();
      const button = { textContent: '' };

      applyTheme(root, button, 'dark');

      expect(root.removeAttribute).toHaveBeenCalledWith('data-theme');
      expect(root.setAttribute).not.toHaveBeenCalled();
      expect(button.textContent).toBe('ライト');
    });
  });
});
