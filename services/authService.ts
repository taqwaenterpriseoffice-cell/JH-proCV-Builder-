export interface ShopUser {
  id: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  geminiApiKey?: string;
}

const TOKEN_KEY = 'jh_soft_cv_auth_token';
const USER_KEY = 'jh_soft_cv_auth_user';

export const authService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): ShopUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setSession(token: string, user: ShopUser) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.geminiApiKey) {
      localStorage.setItem('jh_soft_cv_user_api_key', user.geminiApiKey);
    }
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async register(params: {
    shopName: string;
    ownerName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
    geminiApiKey?: string;
  }): Promise<{ user: ShopUser; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create shop account');
    }

    this.setSession(data.token, data.user);
    return data;
  },

  async login(params: { email: string; password: string }): Promise<{ user: ShopUser; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    this.setSession(data.token, data.user);
    return data;
  },

  async getProfile(): Promise<ShopUser | null> {
    const token = this.getToken();
    if (!token) return null;

    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 401) {
        this.clearSession();
      }
      return null;
    }

    const data = await res.json();
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      if (data.user.geminiApiKey) {
        localStorage.setItem('jh_soft_cv_user_api_key', data.user.geminiApiKey);
      }
      return data.user;
    }
    return null;
  },

  async updateProfile(updates: Partial<ShopUser>): Promise<ShopUser> {
    const token = this.getToken();
    if (!token) throw new Error('Not logged in');

    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update shop details');
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    if (data.user.geminiApiKey !== undefined) {
      localStorage.setItem('jh_soft_cv_user_api_key', data.user.geminiApiKey);
    }
    return data.user;
  },

  logout() {
    this.clearSession();
  }
};
