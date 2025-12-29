/**
 * Fuzzy string matching utilities for search functionality
 */

/**
 * Basic fuzzy match - checks if search term is contained in target string
 * Both strings are normalized (lowercase, trimmed) before comparison
 */
export function fuzzyMatch(searchTerm: string, targetString: string): boolean {
  const search = searchTerm.toLowerCase().trim();
  const target = targetString.toLowerCase();

  if (search.length === 0) {
    return true; // Empty search matches everything
  }

  return target.includes(search);
}

/**
 * Check if search term matches either home or away team
 */
export function matchesTeam(
  searchTerm: string,
  homeTeam: string,
  awayTeam: string
): boolean {
  return fuzzyMatch(searchTerm, homeTeam) || fuzzyMatch(searchTerm, awayTeam);
}

/**
 * Calculate match score for ranking search results
 * Higher score = better match
 * - Exact match: 100
 * - Starts with: 75
 * - Contains: 50
 * - No match: 0
 */
export function getMatchScore(searchTerm: string, targetString: string): number {
  const search = searchTerm.toLowerCase().trim();
  const target = targetString.toLowerCase();

  if (search.length === 0) {
    return 50; // Neutral score for empty search
  }

  // Exact match
  if (target === search) {
    return 100;
  }

  // Starts with
  if (target.startsWith(search)) {
    return 75;
  }

  // Contains
  if (target.includes(search)) {
    return 50;
  }

  // No match
  return 0;
}

/**
 * Get best match score between home and away teams
 */
export function getTeamMatchScore(
  searchTerm: string,
  homeTeam: string,
  awayTeam: string
): number {
  const homeScore = getMatchScore(searchTerm, homeTeam);
  const awayScore = getMatchScore(searchTerm, awayTeam);

  return Math.max(homeScore, awayScore);
}

/**
 * Check if search term matches a sport name or title
 * Handles common sport abbreviations
 */
export function matchesSport(searchTerm: string, sportTitle: string): boolean {
  const search = searchTerm.toLowerCase().trim();
  const title = sportTitle.toLowerCase();

  if (search.length === 0) {
    return true;
  }

  // Direct match
  if (title.includes(search)) {
    return true;
  }

  // Check for common sport keywords
  const sportKeywords: Record<string, string[]> = {
    'nfl': ['football', 'nfl'],
    'nba': ['basketball', 'nba'],
    'nhl': ['hockey', 'nhl'],
    'mlb': ['baseball', 'mlb'],
    'ncaaf': ['college football', 'ncaaf', 'cfb'],
    'ncaab': ['college basketball', 'ncaab', 'cbb'],
  };

  for (const [key, keywords] of Object.entries(sportKeywords)) {
    if (title.includes(key)) {
      return keywords.some(keyword => {
        // Exact match or keyword starts with search
        if (keyword === search || keyword.startsWith(search)) {
          return true;
        }
        // Search is the full phrase (handles "college football" matching "college football")
        if (search === keyword) {
          return true;
        }
        return false;
      });
    }
  }

  return false;
}
