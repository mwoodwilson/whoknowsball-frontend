/**
 * League logo URLs from TheSportsDB API
 *
 * These logos are fetched from TheSportsDB and used in sport selector chips
 * and section headers throughout the app.
 */

export interface LeagueInfo {
  id: string;
  name: string;
  badge: string;
  useEmoji?: boolean;
  emoji?: string;
}

export const LEAGUE_LOGOS: Record<string, LeagueInfo> = {
  americanfootball_nfl: {
    id: '4391',
    name: 'NFL',
    badge: 'https://r2.thesportsdb.com/images/media/league/badge/g85fqz1662057187.png',
  },
  americanfootball_ncaaf: {
    id: 'ncaaf',
    name: 'NCAAF',
    badge: '',
    useEmoji: true,
    emoji: '🏈',
  },
  basketball_nba: {
    id: '4387',
    name: 'NBA',
    badge: 'https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png',
  },
  basketball_ncaab: {
    id: 'ncaab',
    name: 'NCAAB',
    badge: '',
    useEmoji: true,
    emoji: '🏀',
  },
  icehockey_nhl: {
    id: '4380',
    name: 'NHL',
    badge: 'https://r2.thesportsdb.com/images/media/league/badge/4cem2k1619616539.png',
  },
  baseball_mlb: {
    id: '4424',
    name: 'MLB',
    badge: 'https://r2.thesportsdb.com/images/media/league/badge/c5r83j1521893739.png',
  },
};

/**
 * Get league info by sport key
 */
export const getLeagueInfo = (sportKey: string): LeagueInfo | undefined => {
  return LEAGUE_LOGOS[sportKey];
};
