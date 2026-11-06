import { describe, expect, it } from 'vitest';
import {
  STAGING_LINKS,
  isStagingBuild,
  productionUrl,
  showStagingBanner
} from '../staging-banner.js';

describe('staging-banner', () => {
  describe('isStagingBuild', () => {
    it('is true only when VITE_STAGING is "1"', () => {
      expect(isStagingBuild({ VITE_STAGING: '1' })).toBe(true);
      expect(isStagingBuild({ VITE_STAGING: '0' })).toBe(false);
      expect(isStagingBuild({})).toBe(false);
    });

    it('is false for a missing env', () => {
      expect(isStagingBuild(null)).toBe(false);
      expect(isStagingBuild(undefined)).toBe(false);
    });

    it('defaults to import.meta.env, which is not a staging build in tests', () => {
      expect(isStagingBuild()).toBe(false);
    });
  });

  describe('productionUrl', () => {
    it('drops the trailing staging/ segment from the base', () => {
      expect(productionUrl({ BASE_URL: '/bucket-list/staging/' })).toBe(
        '/bucket-list/'
      );
    });

    it('returns the base unchanged when it is not a staging base', () => {
      expect(productionUrl({ BASE_URL: '/bucket-list/' })).toBe('/bucket-list/');
    });

    it('falls back to "/" when BASE_URL is missing', () => {
      expect(productionUrl({})).toBe('/');
      expect(productionUrl(null)).toBe('/');
      expect(productionUrl(undefined)).toBe('/');
    });

    it('defaults to import.meta.env', () => {
      expect(productionUrl()).toBe('/');
    });
  });

  describe('showStagingBanner', () => {
    it('prepends a banner with the label, staging links and production link', () => {
      document.body.innerHTML = '<main id="app"></main>';
      const el = showStagingBanner(document);

      expect(document.body.firstChild).toBe(el);
      expect(el.querySelector('span').textContent).toBe('STAGING｜');

      const anchors = el.querySelectorAll('a');
      // One link per staging app plus the production link.
      expect(anchors).toHaveLength(STAGING_LINKS.length + 1);
      STAGING_LINKS.forEach(([text, href], index) => {
        expect(anchors[index].textContent).toBe(text);
        expect(anchors[index].getAttribute('href')).toBe(href);
      });
      // Adjacent links are separated by a middle dot (none before the first).
      expect(el.textContent).toContain('トップ ・ ブログ');

      const prod = anchors[anchors.length - 1];
      expect(prod.textContent).toBe('本番');
      expect(prod.getAttribute('href')).toBe('/');
      expect(prod.getAttribute('style')).toContain('font-weight:700');
    });

    it('defaults to the global document', () => {
      document.body.innerHTML = '';
      const el = showStagingBanner();
      expect(document.body.firstChild).toBe(el);
    });
  });
});
