const DEFAULT_TIMEOUT = 8000;

export const buildJsonpUrl = (url, callbackParam, callbackName) => {
  const parsed = new URL(url, window.location.origin);
  parsed.searchParams.delete(callbackParam);
  parsed.searchParams.append(callbackParam, callbackName);
  return parsed.toString();
};

export const fetchJsonp = (url, { callbackParam = 'callback', timeout = DEFAULT_TIMEOUT } = {}) =>
  new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement('script');
    let timer;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
      }
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (data) => {
      cleanup();
      if (data && typeof data.error === 'object' && data.error !== null) {
        const { code, message } = data.error;
        const errorMessage = `API Error${code ? ` ${code}` : ''}: ${message || 'Unknown error'}`;
        reject(new Error(errorMessage));
      } else {
        resolve(data);
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('JSONPの読み込みに失敗しました。'));
    };

    script.src = buildJsonpUrl(url, callbackParam, callbackName);
    document.body.appendChild(script);

    timer = setTimeout(() => {
      cleanup();
      reject(new Error('JSONPのタイムアウトが発生しました。'));
    }, timeout);
  });
