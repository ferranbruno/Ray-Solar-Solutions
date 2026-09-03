const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : '/api');

export const getApiUrl = (path) => `${API_BASE_URL}${path}`;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL.replace('/api', '')}/${imagePath}`;
};

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem('ray-solar-refresh-token');
  if (!refreshToken) return null;

  try {
    const response = await fetch(getApiUrl('/auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    localStorage.setItem('ray-solar-access-token', data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);

  const buildHeaders = (token) => {
    const h = new Headers(headers);
    if (token) h.set('Authorization', `Bearer ${token}`);
    if (!(options.body instanceof FormData)) h.set('Content-Type', 'application/json');
    return h;
  };

  let token = localStorage.getItem('ray-solar-access-token');
  let response = await fetch(getApiUrl(path), { ...options, headers: buildHeaders(token) });

  if (response.status === 401) {
    const data = await response.clone().json().catch(() => ({}));
    const message = (data.error || data.msg || '').toLowerCase();
    if (message.includes('expired')) {
      const newToken = await tryRefreshToken();
      if (newToken) {
        response = await fetch(getApiUrl(path), { ...options, headers: buildHeaders(newToken) });
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.msg || 'Request failed');
  }

  return data;
}