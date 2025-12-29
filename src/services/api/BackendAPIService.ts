import axios from 'axios';
import Config from 'react-native-config';
import { supabase } from '../auth/SupabaseAuthService';

class BackendAPIService {
  private baseURL = Config.BACKEND_URL;

  async calculateBKS(betData: any) {
    const response = await this.post('/api/v1/bets/calculate', betData);
    return response.bks;
  }

  async getGames(sport: string) {
    return this.get(`/api/v1/games/${sport}`);
  }

  async getActivityMetrics() {
    return this.get('/api/v1/metrics/activity');
  }

  async getUserStats() {
    return this.get('/api/v1/users/stats');
  }

  async getUserBKSHistory(days: number = 30) {
    return this.get(`/api/v1/users/bks-history?days=${days}`);
  }

  /**
   * Get global leaderboard rankings
   * @param limit Number of entries to return (default: 100, max: 500)
   * @param offset Number of entries to skip for pagination (default: 0)
   * @returns Leaderboard data with rankings, total count, and pagination info
   */
  async getGlobalLeaderboard(limit: number = 100, offset: number = 0) {
    console.log(`[BackendAPI] Fetching global leaderboard (limit=${limit}, offset=${offset})`);
    return this.get(`/api/v1/leaderboard/global?limit=${limit}&offset=${offset}`);
  }

  async getUserBets() {
    console.log('[BackendAPI] Fetching user bets...');
    const response = await this.get('/api/v1/bets');
    console.log('[BackendAPI] Raw response:', JSON.stringify(response).substring(0, 200));

    // Backend returns {success: true, bets: [...], pagination: {...}}
    // Extract and return just the bets array
    const bets = response.bets || [];
    console.log('[BackendAPI] Returning', bets.length, 'bets');
    return bets;
  }

  async placeBet(betData: any) {
    // Detect if this is a parlay (has legs array with 2+ items)
    const isParlay = betData.legs && Array.isArray(betData.legs) && betData.legs.length >= 2;

    if (isParlay) {
      console.log('[BackendAPI] Placing parlay bet with', betData.legs.length, 'legs');
      return this.post('/api/v1/bets/parlay', betData);
    } else {
      console.log('[BackendAPI] Placing single bet');
      return this.post('/api/v1/bets', betData);
    }
  }

  // Security endpoints
  async changePassword(currentPassword: string, newPassword: string) {
    return this.put('/api/v1/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async enable2FA() {
    return this.post('/api/v1/auth/2fa/enable', {});
  }

  async disable2FA(code: string) {
    return this.post('/api/v1/auth/2fa/disable', { code });
  }

  async contactSupport(data: { subject: string; message: string }) {
    return this.post('/api/v1/support/contact', data);
  }

  async deleteAccount(data: { confirmation: string }) {
    return this.delete('/api/v1/users/account', data);
  }

  // Profile endpoints
  async updateProfile(data: { full_name?: string; phone?: string; date_of_birth?: string }) {
    console.log('[BackendAPI] Updating profile:', data);
    return this.put('/api/v1/users/profile', data);
  }

  async updateEmail(data: { new_email: string }) {
    console.log('[BackendAPI] Updating email to:', data.new_email);
    return this.put('/api/v1/users/email', data);
  }

  private async get(endpoint: string) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.baseURL}${endpoint}`, {
      headers,
    });
    return response.data;
  }

  private async post(endpoint: string, data: any) {
    const headers = await this.getHeaders();
    const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
      headers,
    });
    return response.data;
  }

  private async put(endpoint: string, data: any) {
    const headers = await this.getHeaders();
    const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
      headers,
    });
    return response.data;
  }

  private async delete(endpoint: string, data?: any) {
    const headers = await this.getHeaders();
    const response = await axios.delete(`${this.baseURL}${endpoint}`, {
      headers,
      data,
    });
    return response.data;
  }

  private async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    // Get current auth token from Supabase session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      console.log('[BackendAPI] 🔑 Auth token exists:', !!token);

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[BackendAPI] ❌ Error getting auth token:', error);
    }

    // Add API key for ngrok security if configured
    if (Config.API_KEY) {
      headers['X-API-Key'] = Config.API_KEY;
    }

    return headers;
  }
}

export default new BackendAPIService();
