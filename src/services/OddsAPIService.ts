// src/services/OddsAPIService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

/**
 * The Odds API Service
 * Provides real-time sports betting odds via backend API
 *
 * API Details:
 * - Backend URL: From BACKEND_URL environment variable
 * - Endpoint: /api/v1/odds/games
 * - Returns merged odds + scores data with live/upcoming separation
 * - Backend handles quota tracking and rate limiting
 * - Caching: 5-second backend cache + 5-second frontend cache (The Odds API updates every ~10s)
 * - Auto-refresh: Frontend auto-refreshes every 30 seconds with force refresh
 */

const BACKEND_URL = Config.BACKEND_URL || 'http://localhost:3000';
const CACHE_DURATION = 5 * 1000; // 5 seconds (The Odds API updates every ~10s, so 5s keeps data fresh)
const API_TIMEOUT = 30000; // 30 seconds timeout (backend may take 20+ seconds to fetch fresh odds from The Odds API)

/**
 * Fetch with timeout wrapper
 * Prevents slow API responses from blocking the UI
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
};

// Sport Display Names
export const SPORT_DISPLAY_NAMES: Record<string, string> = {
  'americanfootball_nfl': 'NFL',
  'americanfootball_ncaaf': 'College Football',
  'basketball_nba': 'NBA',
  'basketball_ncaab': 'College Basketball',
  'baseball_mlb': 'MLB',
  'icehockey_nhl': 'NHL',
  'soccer_epl': 'Premier League',
  'soccer_usa_mls': 'MLS',
  'soccer_uefa_champs_league': 'Champions League',
  'soccer_spain_la_liga': 'La Liga',
  'soccer_germany_bundesliga': 'Bundesliga',
  'soccer_italy_serie_a': 'Serie A',
};

// Priority sports to fetch first (major US sports)
const PRIORITY_SPORTS = [
  'americanfootball_nfl',
  'basketball_nba',
  'baseball_mlb',
  'icehockey_nhl',
  'americanfootball_ncaaf',
  'basketball_ncaab',
];

// API Response Types
export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface Outcome {
  name: string;
  price: number; // American odds
  point?: number; // Spread or total line
}

export interface Market {
  key: 'h2h' | 'spreads' | 'totals';
  last_update: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface OddsAPIGame {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

// Transformed Game Structure for App
export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  sportKey: string;
  isLive?: boolean;
  scores?: Array<{ name: string; score: string }> | null;
  completed?: boolean;
  odds: {
    spread: {
      home: { line: string; odds: string };
      away: { line: string; odds: string };
    };
    moneyline: {
      home: { odds: string };
      away: { odds: string };
    };
    total: {
      over: { line: string; odds: string };
      under: { line: string; odds: string };
    };
  };
}

// Sport Section for grouped display
export interface SportSection {
  sport: string;
  sportTitle: string;
  games: Game[];
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

class OddsAPIService {

  /**
   * Get data from cache if it exists and is not expired
   */
  private static async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp }: CachedData<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid (within CACHE_DURATION)
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }

      // Cache expired, remove it
      await AsyncStorage.removeItem(key);
      return null;
    } catch (error) {
      console.error('[OddsAPI] Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Save data to cache with timestamp
   */
  private static async saveToCache<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('[OddsAPI] Error saving to cache:', error);
    }
  }


  /**
   * Clear all cached data
   */
  public static async clearCache(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('games:'));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`[OddsAPI] Cleared ${cacheKeys.length} cache entries`);
    } catch (error) {
      console.error('[OddsAPI] Error clearing cache:', error);
    }
  }

  /**
   * Get all active games across all available sports via backend API
   * Backend merges odds + scores data and returns live/upcoming games
   * Returns array of sport sections with games
   * @param forceRefresh - Skip cache and fetch fresh data from backend
   */
  public static async getAllActiveGames(forceRefresh = false): Promise<SportSection[]> {
    try {
      console.log('[OddsAPI] 🚀 Fetching all active games from backend...');
      console.warn('[OddsAPI] ========== STARTING BACKEND API FETCH ==========');

      const cacheKey = 'games:all';

      // Check cache first (unless forceRefresh is true)
      if (!forceRefresh) {
        const cached = await this.getFromCache<SportSection[]>(cacheKey);
        if (cached) {
          console.log('[OddsAPI] ✅ Returning cached games');
          console.warn('[OddsAPI] Using cached games data');
          return cached;
        }
      } else {
        console.log('[OddsAPI] ⚡ Force refresh - skipping cache');
        console.warn('[OddsAPI] FORCE REFRESH - bypassing cache');
      }

      // Fetch from backend
      // Add forceRefresh query parameter if requested
      const url = forceRefresh
        ? `${BACKEND_URL}/api/v1/odds/games?forceRefresh=true`
        : `${BACKEND_URL}/api/v1/odds/games`;
      console.log('[OddsAPI] Backend URL:', url);
      console.warn('[OddsAPI] Calling backend API:', url);

      // Build headers with API key if configured
      const headers: Record<string, string> = {
        'ngrok-skip-browser-warning': 'true', // Skip ngrok interstitial page
      };
      if (Config.API_KEY) {
        headers['X-API-Key'] = Config.API_KEY;
      }

      // Use fetchWithTimeout to prevent slow responses from blocking UI
      const response = await fetchWithTimeout(url, { headers });

      // Handle rate limiting (429) gracefully - use cached data
      if (response.status === 429) {
        console.warn('[OddsAPI] ⚠️ Rate limited - returning cached data');
        const cached = await this.getFromCache<SportSection[]>(cacheKey);
        if (cached) {
          console.log('[OddsAPI] ✅ Returning cached data due to rate limit');
          return cached;
        }
        // If no cache, throw error
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }

      if (!response.ok) {
        const errorMsg = `Backend API error! status: ${response.status}`;
        console.error('[OddsAPI] ❌', errorMsg);
        console.warn('[OddsAPI] ERROR:', errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Backend API returned error');
      }

      console.log('[OddsAPI] Backend response:', {
        live: data.live?.length || 0,
        upcoming: data.upcoming?.length || 0,
        cached: data.cached
      });
      console.warn(`[OddsAPI] Backend returned: ${data.live?.length || 0} live, ${data.upcoming?.length || 0} upcoming`);

      // Combine live and upcoming games
      const allGames = [...(data.live || []), ...(data.upcoming || [])];

      // Filter upcoming games to only show those within the next 2 weeks
      // Keep all live games regardless of date
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

      const filteredGames = allGames.filter((backendGame: any) => {
        // Skip completed games entirely - they should never appear in feed
        if (backendGame.completed) {
          console.log(`[OddsAPI] Filtering out completed game: ${backendGame.away_team} @ ${backendGame.home_team}`);
          return false;
        }

        // Always include live games (that aren't completed)
        if (backendGame.isLive) {
          return true;
        }

        // For upcoming games, only include if within next 2 weeks
        const gameDate = new Date(backendGame.commence_time);
        return gameDate <= twoWeeksFromNow;
      });

      console.log(`[OddsAPI] Filtered ${allGames.length} total games to ${filteredGames.length} (live + upcoming within 2 weeks)`);

      // Transform backend games to frontend format and group by sport
      const sportSectionsMap = new Map<string, SportSection>();

      for (const backendGame of filteredGames) {
        const game = this.transformBackendGame(backendGame);

        if (!sportSectionsMap.has(backendGame.sport_key)) {
          sportSectionsMap.set(backendGame.sport_key, {
            sport: backendGame.sport_key,
            sportTitle: backendGame.sport_display || SPORT_DISPLAY_NAMES[backendGame.sport_key] || backendGame.sport_key,
            games: []
          });
        }

        sportSectionsMap.get(backendGame.sport_key)!.games.push(game);
      }

      const sectionsWithGames = Array.from(sportSectionsMap.values())
        .filter(section => section.games.length > 0);

      // Cache the result
      await this.saveToCache(cacheKey, sectionsWithGames);

      console.log(`[OddsAPI] ✅ Loaded ${sectionsWithGames.length} sports with games`);
      console.warn(`[OddsAPI] ========== FETCH COMPLETE: ${sectionsWithGames.length} sports with games ==========`);
      sectionsWithGames.forEach(section => {
        console.log(`  - ${section.sportTitle}: ${section.games.length} games`);
        console.warn(`[OddsAPI] ${section.sportTitle}: ${section.games.length} games`);
      });

      return sectionsWithGames;
    } catch (error) {
      console.error('[OddsAPI] Error fetching all active games:', error);
      throw error;
    }
  }

  /**
   * Fuzzy team name matching helper
   * Handles whitespace, case, and common abbreviations
   */
  private static matchesTeamName(outcomeName: string, teamName: string): boolean {
    if (!outcomeName || !teamName) return false;

    // Normalize: trim, lowercase, remove extra spaces
    const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedOutcome = normalize(outcomeName);
    const normalizedTeam = normalize(teamName);

    // Exact match after normalization
    if (normalizedOutcome === normalizedTeam) return true;

    // Check if one contains the other (handles abbreviations like "LA" in "Los Angeles")
    if (normalizedOutcome.includes(normalizedTeam) || normalizedTeam.includes(normalizedOutcome)) {
      return true;
    }

    return false;
  }

  /**
   * Find outcome matching team name with fuzzy matching and fallback logic
   */
  private static findTeamOutcome(outcomes: any[], teamName: string, position: 'first' | 'second'): any | undefined {
    if (!outcomes || outcomes.length === 0) return undefined;

    // Try fuzzy matching first
    const matched = outcomes.find((o: any) => this.matchesTeamName(o.name, teamName));
    if (matched) return matched;

    // Fallback: use position (first outcome = away, second = home by convention)
    const fallback = position === 'first' ? outcomes[0] : outcomes[1];
    if (fallback) {
      console.warn(`[OddsAPI] Team name match failed for "${teamName}", using ${position} outcome: "${fallback.name}"`);
    }
    return fallback;
  }

  /**
   * Get odds for a specific market from the single bookmaker
   * Backend now sends only one bookmaker per game (FanDuel primary)
   * so we no longer need to aggregate across multiple sources
   */
  private static getOddsForMarket(
    bookmakers: any[],
    marketKey: 'spreads' | 'h2h' | 'totals',
    teamName: string,
    position: 'first' | 'second',
    outcomeType?: 'over' | 'under'
  ): { odds: string; line?: string; bookmaker?: string } | null {
    // Backend now sends single bookmaker - use first one
    const bookmaker = bookmakers[0];
    if (!bookmaker) return null;

    const market = bookmaker.markets?.find((m: any) => m.key === marketKey);
    if (!market || !market.outcomes) return null;

    let outcome: any;

    if (marketKey === 'totals' && outcomeType) {
      // For totals, match Over/Under
      outcome = market.outcomes.find((o: any) => o.name?.toLowerCase() === outcomeType);
    } else {
      // For spread/h2h, match team name
      outcome = this.findTeamOutcome(market.outcomes, teamName, position);
    }

    if (!outcome || outcome.price === undefined) return null;

    const oddsValue = outcome.price;
    const result: any = {
      odds: oddsValue > 0 ? `+${oddsValue}` : `${oddsValue}`,
      bookmaker: bookmaker.name || bookmaker.key
    };

    // Include line/point if available
    if (outcome.point !== undefined) {
      if (marketKey === 'spreads') {
        result.line = outcome.point > 0 ? `+${outcome.point}` : `${outcome.point}`;
      } else if (marketKey === 'totals') {
        result.line = outcomeType === 'over' ? `O ${outcome.point}` : `U ${outcome.point}`;
      }
    }

    return result;
  }

  /**
   * Transform backend game format to frontend Game format
   * Backend now sends single bookmaker source per game for consistent odds
   */
  private static transformBackendGame(backendGame: any): Game {
    const bookmakers = backendGame.bookmakers || [];
    const oddsSource = backendGame.odds_source || bookmakers[0]?.key || 'unknown';

    console.log(`[OddsAPI] Transforming: ${backendGame.away_team} @ ${backendGame.home_team} (source: ${oddsSource})`);

    // Build odds object with defaults (grey out buttons if no bookmakers offer the market)
    const odds: Game['odds'] = {
      spread: {
        home: { line: '+0', odds: '+100' },
        away: { line: '+0', odds: '+100' },
      },
      moneyline: {
        home: { odds: '+100' },
        away: { odds: '+100' },
      },
      total: {
        over: { line: 'O 0', odds: '+100' },
        under: { line: 'U 0', odds: '+100' },
      },
    };

    // Get spread odds from single bookmaker
    const homeSpread = this.getOddsForMarket(bookmakers, 'spreads', backendGame.home_team, 'second');
    const awaySpread = this.getOddsForMarket(bookmakers, 'spreads', backendGame.away_team, 'first');

    if (homeSpread) {
      odds.spread.home = {
        line: homeSpread.line || '+0',
        odds: homeSpread.odds,
      };
    }

    if (awaySpread) {
      odds.spread.away = {
        line: awaySpread.line || '+0',
        odds: awaySpread.odds,
      };
    }

    // Log spread consistency check
    if (homeSpread && awaySpread) {
      console.log(`[OddsAPI]   ✅ Spread: ${awaySpread.line} / ${homeSpread.line} (${oddsSource})`);
    }

    // Get moneyline odds from single bookmaker
    const homeML = this.getOddsForMarket(bookmakers, 'h2h', backendGame.home_team, 'second');
    const awayML = this.getOddsForMarket(bookmakers, 'h2h', backendGame.away_team, 'first');

    if (homeML) {
      odds.moneyline.home = {
        odds: homeML.odds,
      };
    }

    if (awayML) {
      odds.moneyline.away = {
        odds: awayML.odds,
      };
    }

    if (homeML && awayML) {
      console.log(`[OddsAPI]   ✅ ML: ${awayML.odds} / ${homeML.odds} (${oddsSource})`);
    }

    // Get totals odds from single bookmaker
    const over = this.getOddsForMarket(bookmakers, 'totals', backendGame.home_team, 'second', 'over');
    const under = this.getOddsForMarket(bookmakers, 'totals', backendGame.away_team, 'first', 'under');

    if (over) {
      odds.total.over = {
        line: over.line || 'O 0',
        odds: over.odds,
      };
    }

    if (under) {
      odds.total.under = {
        line: under.line || 'U 0',
        odds: under.odds,
      };
    }

    // Log total consistency check
    if (over && under) {
      console.log(`[OddsAPI]   ✅ Total: ${over.line} / ${under.line} (${oddsSource})`);
    }

    // Pass raw commence_time to let GameCard format based on game status
    return {
      id: backendGame.game_id,
      homeTeam: backendGame.home_team,
      awayTeam: backendGame.away_team,
      commenceTime: backendGame.commence_time, // Pass raw ISO datetime
      sportKey: backendGame.sport_key,
      isLive: backendGame.isLive || false,
      scores: backendGame.scores || null,
      completed: backendGame.completed || false,
      odds,
    };
  }
}

export default OddsAPIService;
