const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || '/api').replace(/\/$/, '');

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('jarvis_token');
  }

  public static setToken(token: string) {
    localStorage.setItem('jarvis_token', token);
  }

  public static clearToken() {
    localStorage.removeItem('jarvis_token');
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      this.clearToken();
      window.location.href = '/login';
      throw new Error('Session expired. Please log in.');
    }

    if (!response.ok) {
      let errDetail = 'An operational error occurred';
      try {
        const errorData = await response.json();
        errDetail = errorData.detail || errorData.message || errDetail;
      } catch {}
      throw new Error(errDetail);
    }

    // Return empty object for 204 or empty bodies
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth Endpoints
  public static async register(data: any) {
    return this.request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  public static async login(data: any) {
    return this.request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  }

  public static async logout() {
    try {
      await this.request<any>('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  public static async getMe() {
    return this.request<any>('/auth/me');
  }

  public static async forgotPassword(email: string) {
    return this.request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  }

  public static async resetPassword(data: any) {
    return this.request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });
  }

  public static async changePassword(data: any) {
    return this.request<any>('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });
  }

  public static async getSessions() {
    return this.request<any[]>('/auth/sessions');
  }

  public static async revokeOtherSessions() {
    return this.request<any>('/auth/sessions', { method: 'DELETE' });
  }

  // Dashboard
  public static async getDashboard() {
    return this.request<any>('/dashboard');
  }

  // AI & Chat
  public static async sendChatMessage(message: string, conversationId?: number) {
    return this.request<any>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
  }

  // Conversations
  public static async getConversations() {
    return this.request<any[]>('/conversations');
  }

  public static async getConversation(id: number) {
    return this.request<any>(`/conversations/${id}`);
  }

  public static async createConversation(title?: string) {
    return this.request<any>('/conversations', { method: 'POST', body: JSON.stringify({ title }) });
  }

  public static async updateConversation(id: number, title: string) {
    return this.request<any>(`/conversations/${id}`, { method: 'PUT', body: JSON.stringify({ title }) });
  }

  public static async deleteConversation(id: number) {
    return this.request<any>(`/conversations/${id}`, { method: 'DELETE' });
  }

  // Tasks
  public static async getTasks() {
    return this.request<any[]>('/tasks');
  }

  public static async createTask(task: any) {
    return this.request<any>('/tasks', { method: 'POST', body: JSON.stringify(task) });
  }

  public static async updateTask(id: number, updates: any) {
    return this.request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  }

  public static async deleteTask(id: number) {
    return this.request<any>(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Memory
  public static async getMemories() {
    return this.request<any[]>('/memory');
  }

  public static async createMemory(memory: any) {
    return this.request<any>('/memory', { method: 'POST', body: JSON.stringify(memory) });
  }

  public static async updateMemory(id: number, memory: any) {
    return this.request<any>(`/memory/${id}`, { method: 'PUT', body: JSON.stringify(memory) });
  }

  public static async deleteMemory(id: number) {
    return this.request<any>(`/memory/${id}`, { method: 'DELETE' });
  }

  // Live Intelligence Feeds
  public static async getNews(category: string = 'top', query?: string) {
    const q = query ? `&query=${encodeURIComponent(query)}` : '';
    return this.request<any>(`/news?category=${category}${q}`);
  }

  public static async getSports(category: string = 'cricket', tab: string = 'live') {
    return this.request<any>(`/sports?category=${category}&tab=${tab}`);
  }

  public static async getWeather(city?: string, lat?: number, lon?: number) {
    let q = '';
    if (city) q = `?city=${encodeURIComponent(city)}`;
    else if (lat && lon) q = `?lat=${lat}&lon=${lon}`;
    return this.request<any>(`/weather${q}`);
  }

  public static async performSearch(query: string, category: string = 'google') {
    return this.request<any>(`/search?q=${encodeURIComponent(query)}&category=${category}`);
  }

  // Notifications
  public static async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  public static async markNotificationRead(id: number) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PUT' });
  }

  public static async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', { method: 'PUT' });
  }

  public static async deleteNotification(id: number) {
    return this.request<any>(`/notifications/${id}`, { method: 'DELETE' });
  }

  // Profile & Settings
  public static async getProfile() {
    return this.request<any>('/profile');
  }

  public static async updateProfile(data: any) {
    return this.request<any>('/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  public static async getUserSettings() {
    return this.request<any>('/profile/settings');
  }

  public static async updateUserSettings(data: any) {
    return this.request<any>('/profile/settings', { method: 'PUT', body: JSON.stringify(data) });
  }

  public static async exportUserData() {
    return this.request<any>('/profile/export');
  }

  public static async deleteAccount() {
    return this.request<any>('/profile', { method: 'DELETE' });
  }

  // System Telemetry
  public static async getSystemStatus() {
    return this.request<any>('/system/status');
  }

  // Admin
  public static async getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  public static async getAdminUsers() {
    return this.request<any[]>('/admin/users');
  }

  public static async updateAdminUser(id: number, data: any) {
    return this.request<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  public static async deleteAdminUser(id: number) {
    return this.request<any>(`/admin/users/${id}`, { method: 'DELETE' });
  }
}
