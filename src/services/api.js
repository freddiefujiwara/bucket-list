import { DATA_URL } from '../config';

export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }

  get isAuthError() {
    return this.code === 401 || this.code === 403;
  }
}

const parseResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('サーバーからの応答を読み取れませんでした。', 0);
  }
  if (data && typeof data === 'object' && !Array.isArray(data) && data.error) {
    const { code, message } = data.error;
    throw new ApiError(message || 'APIエラーが発生しました。', code || 0);
  }
  return data;
};

const applyAuthParams = (url, auth) => {
  if (auth?.shareToken) {
    url.searchParams.set('share_token', auth.shareToken);
  } else if (auth?.idToken) {
    url.searchParams.set('id_token', auth.idToken);
  }
};

export const fetchItems = async (auth) => {
  const url = new URL(DATA_URL);
  applyAuthParams(url, auth);
  const response = await fetch(url.toString());
  return parseResponse(response);
};

export const postAction = async (auth, action, payload = {}) => {
  const body = { action, ...payload };
  if (auth?.shareToken) {
    body.share_token = auth.shareToken;
  } else if (auth?.idToken) {
    body.id_token = auth.idToken;
  }
  const response = await fetch(DATA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  return parseResponse(response);
};

const shareAction = async (idToken, action) => {
  const url = new URL(DATA_URL);
  url.searchParams.set('action', action);
  url.searchParams.set('id_token', idToken);
  const response = await fetch(url.toString());
  return parseResponse(response);
};

export const issueShare = (idToken) => shareAction(idToken, 'issue_share');

export const revokeShare = (idToken) => shareAction(idToken, 'revoke_share');
