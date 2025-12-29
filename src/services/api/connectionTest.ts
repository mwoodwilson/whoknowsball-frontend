import axios from 'axios';
import Config from 'react-native-config';

export const testConnection = async () => {
  try {
    console.log('Testing backend at:', Config.BACKEND_URL);

    // Build headers with API key if configured
    const headers: Record<string, string> = {};
    if (Config.API_KEY) {
      headers['X-API-Key'] = Config.API_KEY;
    }

    const response = await axios.get(
      `${Config.BACKEND_URL}/api/v1/metrics/activity`,
      { headers }
    );
    console.log('✅ Backend connected:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
};
