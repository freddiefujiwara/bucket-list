import { computed, onMounted, ref, watch } from 'vue';
import { GOOGLE_CLIENT_ID } from '../config';
import { parseShareToken } from '../utils/share';

const ID_TOKEN_KEY = 'bucket-list:id-token';
const SHARE_TOKEN_KEY = 'bucket-list:share-token';

/**
 * Authentication for the management app, same scheme as health/asset:
 * the owner signs in with Google (ID token), or opens a temporary share
 * link (#share=...) whose token is owner-equivalent for 30 days.
 */
export const useAuth = () => {
  const idToken = ref('');
  const shareToken = ref('');
  const googleReady = ref(false);
  const googleScriptError = ref(false);
  const googleButtonRoot = ref(null);

  const isAuthenticated = computed(() => Boolean(shareToken.value || idToken.value));
  const isOwner = computed(() => Boolean(idToken.value));
  const authParams = computed(() => ({
    idToken: idToken.value,
    shareToken: shareToken.value
  }));

  // Tokens are read synchronously so callers can react to the initial
  // authentication state during setup.
  const fromHash = parseShareToken(window.location.hash);
  if (fromHash) {
    shareToken.value = fromHash;
    localStorage.setItem(SHARE_TOKEN_KEY, fromHash);
  } else {
    shareToken.value = localStorage.getItem(SHARE_TOKEN_KEY) || '';
  }
  idToken.value = localStorage.getItem(ID_TOKEN_KEY) || '';

  const handleGoogleCredential = (response) => {
    const credential = response?.credential;
    if (!credential) {
      return;
    }
    idToken.value = credential;
    localStorage.setItem(ID_TOKEN_KEY, credential);
  };

  const renderGoogleButton = () => {
    if (!googleReady.value || !googleButtonRoot.value) {
      return;
    }
    if (!window.google?.accounts?.id) {
      return;
    }
    googleButtonRoot.value.innerHTML = '';
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential
    });
    window.google.accounts.id.renderButton(googleButtonRoot.value, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill'
    });
  };

  const loadGoogleScript = () => {
    if (window.google?.accounts?.id) {
      googleReady.value = true;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleReady.value = true;
    };
    script.onerror = () => {
      googleScriptError.value = true;
    };
    document.head.appendChild(script);
  };

  const logout = () => {
    idToken.value = '';
    shareToken.value = '';
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(SHARE_TOKEN_KEY);
  };

  onMounted(loadGoogleScript);
  watch([googleReady, googleButtonRoot], renderGoogleButton);

  return {
    idToken,
    shareToken,
    isAuthenticated,
    isOwner,
    authParams,
    googleReady,
    googleScriptError,
    googleButtonRoot,
    handleGoogleCredential,
    logout
  };
};
