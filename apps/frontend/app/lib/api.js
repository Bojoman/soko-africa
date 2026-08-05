// API client — auth tokens live in httpOnly cookies set by /api/auth/* routes.
const API_BASE_URL = '/api';

let refreshInFlight = null;

async function tryRefreshSession() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  }).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

function clearClientAuthState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('soko_africa_user');
  // Legacy keys from pre-cookie auth — remove if present.
  localStorage.removeItem('soko_africa_token');
  localStorage.removeItem('soko_africa_refresh_token');
}

/**
 * @param {string} endpoint
 * @param {RequestInit & { _retried?: boolean, skipRefresh?: boolean }} options
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  const response = await fetch(url, config);

  // Never recurse refresh; skip for bootstrap auth endpoints to avoid guest 401 storms.
  const skipRefresh =
    options.skipRefresh ||
    endpoint === '/auth/refresh' ||
    endpoint === '/auth/login' ||
    endpoint === '/auth/register';

  if (response.status === 401 && !options._retried && !skipRefresh) {
    const refreshed = await tryRefreshSession();
    if (refreshed.ok) {
      return apiClient(endpoint, { ...options, _retried: true });
    }
    clearClientAuthState();
  }

  return response;
}

export async function get(endpoint) {
  const response = await apiClient(endpoint, { method: 'GET' });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

export async function post(endpoint, data) {
  const response = await apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `API Error: ${response.status}` }));
    throw buildApiError(error, response.status);
  }
  return response.json();
}

export async function put(endpoint, data) {
  const response = await apiClient(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

export async function patch(endpoint, data) {
  const response = await apiClient(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `API Error: ${response.status}` }));
    throw buildApiError(error, response.status);
  }
  return response.json();
}

function buildApiError(payload, status) {
  const baseMessage = payload?.message || `API Error: ${status}`;
  const details = Array.isArray(payload?.details) ? payload.details : null;
  const message =
    details && details.length
      ? `${baseMessage}: ${details.map((d) => `${d.field || 'field'} ${d.message}`).join('; ')}`
      : baseMessage;
  const err = new Error(message);
  err.status = status;
  err.details = details;
  err.code = payload?.error;
  return err;
}

export async function del(endpoint) {
  const response = await apiClient(endpoint, { method: 'DELETE' });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

export const authApi = {
  login: (email, password) => post('/auth/login', { email, password }),
  register: (userData) =>
    post('/auth/register', {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role
    }),
  logout: () => post('/auth/logout', {}),
  refresh: () => post('/auth/refresh', {}),
  me: async () => {
    // Soft probe first — guests have no cookies; avoid a useless refresh round-trip.
    const response = await apiClient('/auth/me', {
      method: 'GET',
      skipRefresh: true
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      if (data.code === 'NO_SESSION') {
        throw new Error('Unauthorized');
      }
      const refreshed = await tryRefreshSession();
      if (refreshed.ok) {
        return get('/auth/me');
      }
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return data;
  },
  updateProfile: (data) => patch('/auth/me', data),
  forgotPassword: (email) => post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => post('/auth/reset-password', { token, password })
};

export const productsApi = {
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return get(`/products?${queryString}`);
  },
  getById: (id) => get(`/products/${id}`),
  create: (data) => post('/products', data),
  update: (id, data) => patch(`/products/${id}`, data),
  remove: (id) => del(`/products/${id}`),
  listMine: () => get('/seller/products')
};

export const ordersApi = {
  list: () => get('/orders')
};

export const sellersApi = {
  list: () => get('/sellers'),
  getBySlug: (slug) => get(`/sellers/${slug}`),
  getProducts: (slug, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/sellers/${slug}/products?${qs}`);
  },
  create: (data) => post('/sellers', data)
};

export const statsApi = {
  platform: () => get('/stats/platform'),
  testimonials: () => get('/stats/testimonials')
};

export const analyticsApi = {
  seller: (range = '30d') => get(`/seller/analytics?range=${encodeURIComponent(range)}`)
};

export const adminApi = {
  dashboard: () => get('/admin/dashboard'),
  approveSeller: (id) => post(`/admin/sellers/${id}/approve`, {}),
  rejectSeller: (id) => post(`/admin/sellers/${id}/reject`, {}),
  publishProduct: (id) => post(`/admin/products/${id}/publish`, {})
};

export const paymentMethodsApi = {
  list: () => get('/account/payment-methods'),
  create: (data) => post('/account/payment-methods', data),
  setDefault: (id) => patch(`/account/payment-methods/${id}/default`, {}),
  remove: (id) => del(`/account/payment-methods/${id}`)
};
