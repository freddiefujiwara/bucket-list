export const DATA_URL =
  import.meta.env.VITE_DATA_URL ||
  'https://script.google.com/macros/s/AKfycbwUF0Lt3OG5kE0IqTyrkciEcUFIXZULI7aM-xJtR_4nrvqOSlIOVKADtFolAvSwFko6Vw/exec';

// Shared OAuth client ID used by the freddiefujiwara.com apps (health, asset,
// alarm) to verify the owner's Google ID token. Client IDs are public
// identifiers that ship in the built JavaScript bundle.
export const GOOGLE_CLIENT_ID =
  '728154182351-5ribj1diqcp8jpfo3rnqk9rei1aka98t.apps.googleusercontent.com';
