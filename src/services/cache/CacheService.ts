import { MMKV } from 'react-native-mmkv';
import DeviceInfo from 'react-native-device-info';

class CacheService {
  private storage: MMKV;

  constructor() {
    const deviceId = DeviceInfo.getUniqueId();
    this.storage = new MMKV({
      id: 'bks-cache',
      encryptionKey: this.generateKey(deviceId)
    });
  }

  private generateKey(deviceId: string): string {
    return `${deviceId}-bks-2024`;
  }

  cacheTeamLogo(teamName: string, logoUrl: string) {
    const key = `logo:${teamName}`;
    const data = JSON.stringify({
      url: logoUrl,
      cachedAt: Date.now(),
      ttl: 86400000 // 24 hours
    });
    this.storage.set(key, data);
  }

  getCachedLogo(teamName: string): string | null {
    const key = `logo:${teamName}`;
    const cached = this.storage.getString(key);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const isExpired = Date.now() - data.cachedAt > data.ttl;

    if (isExpired) {
      this.storage.delete(key);
      return null;
    }

    return data.url;
  }

  clearCache() {
    this.storage.clearAll();
  }
}

export default new CacheService();
