import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useAuth } from '../composables/useAuth';

const mountAuth = () => {
  let auth;
  const component = defineComponent({
    setup() {
      auth = useAuth();
      return () => h('div');
    }
  });
  const wrapper = mount(component);
  return { auth, wrapper };
};

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', window.location.pathname);
    delete window.google;
  });

  afterEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', window.location.pathname);
    delete window.google;
  });

  it('starts unauthenticated without any token', () => {
    const { auth } = mountAuth();
    expect(auth.isAuthenticated.value).toBe(false);
    expect(auth.isOwner.value).toBe(false);
    expect(auth.authParams.value).toEqual({ idToken: '', shareToken: '' });
  });

  it('takes the share token from the URL hash and stores it', () => {
    window.history.replaceState(null, '', `${window.location.pathname}#share=hash-token`);
    const { auth } = mountAuth();
    expect(auth.shareToken.value).toBe('hash-token');
    expect(auth.isAuthenticated.value).toBe(true);
    expect(localStorage.getItem('bucket-list:share-token')).toBe('hash-token');
  });

  it('restores stored tokens', () => {
    localStorage.setItem('bucket-list:share-token', 'stored-share');
    localStorage.setItem('bucket-list:id-token', 'stored-id');
    const { auth } = mountAuth();
    expect(auth.shareToken.value).toBe('stored-share');
    expect(auth.idToken.value).toBe('stored-id');
    expect(auth.isOwner.value).toBe(true);
  });

  it('stores the Google credential as the id token', () => {
    const { auth } = mountAuth();
    auth.handleGoogleCredential({});
    expect(auth.idToken.value).toBe('');
    auth.handleGoogleCredential({ credential: 'cred-1' });
    expect(auth.idToken.value).toBe('cred-1');
    expect(localStorage.getItem('bucket-list:id-token')).toBe('cred-1');
  });

  it('clears both tokens on logout', () => {
    localStorage.setItem('bucket-list:share-token', 'stored-share');
    localStorage.setItem('bucket-list:id-token', 'stored-id');
    const { auth } = mountAuth();
    auth.logout();
    expect(auth.isAuthenticated.value).toBe(false);
    expect(localStorage.getItem('bucket-list:share-token')).toBe(null);
    expect(localStorage.getItem('bucket-list:id-token')).toBe(null);
  });

  it('uses the already loaded Google script and renders the button', async () => {
    const initialize = vi.fn();
    const renderButton = vi.fn();
    window.google = { accounts: { id: { initialize, renderButton } } };

    const { auth } = mountAuth();
    await nextTick();
    expect(auth.googleReady.value).toBe(true);

    const root = document.createElement('div');
    auth.googleButtonRoot.value = root;
    await nextTick();

    expect(initialize).toHaveBeenCalledWith({
      client_id: expect.any(String),
      callback: auth.handleGoogleCredential
    });
    expect(renderButton).toHaveBeenCalledWith(root, expect.objectContaining({ theme: 'outline' }));
  });

  it('does not render the button while Google is unavailable', async () => {
    const { auth } = mountAuth();
    await nextTick();
    // The GIS script was appended but never loaded: google stays undefined.
    auth.googleReady.value = true;
    auth.googleButtonRoot.value = document.createElement('div');
    await nextTick();
    expect(auth.googleScriptError.value).toBe(false);
  });

  const lastGisScript = () => {
    const scripts = document.head.querySelectorAll('script[src*="gsi/client"]');
    return scripts[scripts.length - 1];
  };

  it('marks googleReady when the GIS script loads', async () => {
    const { auth } = mountAuth();
    const script = lastGisScript();
    expect(script).toBeTruthy();
    script.onload();
    await nextTick();
    expect(auth.googleReady.value).toBe(true);
  });

  it('marks googleScriptError when the GIS script fails', async () => {
    const { auth } = mountAuth();
    const script = lastGisScript();
    script.onerror();
    await nextTick();
    expect(auth.googleScriptError.value).toBe(true);
  });
});
