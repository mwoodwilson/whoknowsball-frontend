import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Bet {
  id: string;
  game_id: string;
  sport_key: string;
  teams: string; // "Away @ Home"
  bet_type: string; // 'moneyline', 'spread', 'total', 'player_prop'
  market_type: string; // '2way', '3way'
  selection: string; // 'home', 'away', 'over', 'under', 'draw'
  odds: number;
  opposing_odds?: number;
  raw_odds_display?: string | null;
  american_odds: string;
  commence_time: string;
  context?: string;

  // Extended fields for validation
  player_name?: string;
  stat_type?: string; // 'passing_yards', 'points', 'rebounds', etc.
  period?: string; // '1Q', '1H', 'FULL'
  is_alt_line?: boolean;
  line?: number;
}

export interface ValidationResult {
  valid: boolean;
  invalidReason?: string; // For internal logging only
  hasInvalidCombinations?: boolean; // For betslip title update
  parlayType?: ParlayType;
  legCount?: number;
}

export enum ParlayType {
  SINGLE_BET = 'SINGLE_BET',
  REGULAR_PARLAY = 'REGULAR_PARLAY',
  SAME_GAME_PARLAY = 'SAME_GAME_PARLAY',
}

interface RestrictionLog {
  timestamp: string;
  rule: string;
  sport: string;
  betCount: number;
}

// ============================================================================
// NY STATE BLOCKED TEAMS
// ============================================================================

const NY_COLLEGE_TEAMS = [
  'Syracuse', 'Syracuse Orange',
  'Buffalo', 'Buffalo Bulls',
  'Army', 'Army Black Knights',
  'St. Bonaventure', 'St. Bonaventure Bonnies',
  'Iona', 'Iona Gaels',
  'Siena', 'Siena Saints',
  'Canisius', 'Canisius Golden Griffins',
  'Niagara', 'Niagara Purple Eagles',
  'Marist', 'Marist Red Foxes',
  'Manhattan', 'Manhattan Jaspers',
  'Fordham', 'Fordham Rams',
  'Columbia', 'Columbia Lions',
  'Cornell', 'Cornell Big Red',
  'Colgate', 'Colgate Raiders',
  'Binghamton', 'Binghamton Bearcats',
  'Albany', 'Albany Great Danes',
  'Stony Brook', 'Stony Brook Seawolves',
  'Wagner', 'Wagner Seahawks',
  'LIU', 'LIU Sharks',
  'St. Francis Brooklyn', 'St. Francis Brooklyn Terriers',
];

// ============================================================================
// PARLAY VALIDATION SERVICE
// ============================================================================

class ParlayValidationService {
  private static readonly MAX_REGULAR_PARLAY_LEGS = 10; // Caesars limit (most restrictive)
  private static readonly MAX_SGP_LEGS = 10;
  private static readonly RESTRICTION_LOG_KEY = '@parlay_restriction_logs';

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  /**
   * Validate adding a new bet to existing bets
   * Returns validation result with internal reason for logging
   */
  public static validate(existingBets: Bet[], newBet: Bet): ValidationResult {
    // Single bet is always valid
    if (existingBets.length === 0) {
      return { valid: true, parlayType: ParlayType.SINGLE_BET, legCount: 1 };
    }

    const allBets = [...existingBets, newBet];
    const parlayType = this.detectParlayType(allBets);

    // Check max leg limits
    const maxLegs = parlayType === ParlayType.SAME_GAME_PARLAY
      ? this.MAX_SGP_LEGS
      : this.MAX_REGULAR_PARLAY_LEGS;

    if (allBets.length > maxLegs) {
      this.logRestriction('MAX_LEGS_EXCEEDED', newBet.sport_key, allBets.length);
      return {
        valid: false,
        invalidReason: `Maximum ${maxLegs} legs exceeded`,
        hasInvalidCombinations: true,
        parlayType,
        legCount: allBets.length,
      };
    }

    // Check NY state restrictions
    if (this.isNYStateRestricted(newBet)) {
      this.logRestriction('NY_STATE_COLLEGE', newBet.sport_key, allBets.length);
      return {
        valid: false,
        invalidReason: 'NY state college restriction',
        hasInvalidCombinations: true,
        parlayType,
        legCount: allBets.length,
      };
    }

    // Check universal restrictions
    for (const existingBet of existingBets) {
      const restriction = this.checkUniversalRestrictions(existingBet, newBet);
      if (!restriction.valid) {
        this.logRestriction(restriction.invalidReason!, newBet.sport_key, allBets.length);
        return {
          ...restriction,
          hasInvalidCombinations: true,
          parlayType,
          legCount: allBets.length,
        };
      }
    }

    // Check sport-specific restrictions for SGP
    if (parlayType === ParlayType.SAME_GAME_PARLAY) {
      for (const existingBet of existingBets) {
        const restriction = this.checkSportSpecificRestrictions(existingBet, newBet);
        if (!restriction.valid) {
          this.logRestriction(restriction.invalidReason!, newBet.sport_key, allBets.length);
          return {
            ...restriction,
            hasInvalidCombinations: true,
            parlayType,
            legCount: allBets.length,
          };
        }
      }
    }

    return { valid: true, parlayType, legCount: allBets.length };
  }

  /**
   * Check if current betslip has any invalid combinations
   * Used to update betslip title
   */
  public static hasInvalidCombinations(bets: Bet[]): boolean {
    if (bets.length <= 1) return false;

    // Check all pairs for violations
    for (let i = 0; i < bets.length; i++) {
      for (let j = i + 1; j < bets.length; j++) {
        const check = this.checkUniversalRestrictions(bets[i], bets[j]);
        if (!check.valid) return true;

        // Also check sport-specific if same game
        if (this.isSameGame(bets[i], bets[j])) {
          const sportCheck = this.checkSportSpecificRestrictions(bets[i], bets[j]);
          if (!sportCheck.valid) return true;
        }
      }

      // Check NY restrictions
      if (this.isNYStateRestricted(bets[i])) return true;
    }

    return false;
  }

  // ==========================================================================
  // UNIVERSAL RESTRICTIONS
  // ==========================================================================

  private static checkUniversalRestrictions(bet1: Bet, bet2: Bet): ValidationResult {
    // 0. Duplicate selection check (applies across all games)
    if (this.isDuplicateSelection(bet1, bet2)) {
      return { valid: false, invalidReason: 'DUPLICATE_SELECTION' };
    }

    // Not same game - no restrictions
    if (!this.isSameGame(bet1, bet2)) {
      return { valid: true };
    }

    // 1. Same team ML + spread
    if (this.isSameTeam(bet1, bet2)) {
      if (
        (bet1.bet_type === 'moneyline' && bet2.bet_type === 'spread') ||
        (bet1.bet_type === 'spread' && bet2.bet_type === 'moneyline')
      ) {
        return { valid: false, invalidReason: 'SAME_TEAM_ML_AND_SPREAD' };
      }
    }

    // 2. Spread + alt spread (same team/direction)
    if (bet1.bet_type === 'spread' && bet2.bet_type === 'spread') {
      if (this.isSameTeam(bet1, bet2)) {
        if (bet1.is_alt_line || bet2.is_alt_line) {
          return { valid: false, invalidReason: 'SPREAD_AND_ALT_SPREAD' };
        }
      }
    }

    // 3. Total + alt total (same direction)
    if (bet1.bet_type === 'total' && bet2.bet_type === 'total') {
      if (bet1.selection === bet2.selection) { // Both over or both under
        if (bet1.is_alt_line || bet2.is_alt_line) {
          return { valid: false, invalidReason: 'TOTAL_AND_ALT_TOTAL' };
        }
      }
    }

    // 4. Player prop + alt prop (same player/stat)
    if (this.isSamePlayer(bet1, bet2)) {
      if (bet1.stat_type === bet2.stat_type) {
        if (bet1.is_alt_line || bet2.is_alt_line) {
          return { valid: false, invalidReason: 'PLAYER_PROP_AND_ALT_PROP' };
        }
      }
    }

    // 5. Team A ML + Team B ML (opposite sides same game)
    if (bet1.bet_type === 'moneyline' && bet2.bet_type === 'moneyline') {
      if (!this.isSameTeam(bet1, bet2)) {
        return { valid: false, invalidReason: 'OPPOSITE_MONEYLINES_SAME_GAME' };
      }
    }

    // 6. Any spread + any moneyline from same game (highly correlated)
    if (
      (bet1.bet_type === 'spread' && bet2.bet_type === 'moneyline') ||
      (bet1.bet_type === 'moneyline' && bet2.bet_type === 'spread')
    ) {
      return { valid: false, invalidReason: 'SPREAD_AND_MONEYLINE_SAME_GAME' };
    }

    // 7. Opposing totals (Over vs Under on same line)
    if (bet1.bet_type === 'total' && bet2.bet_type === 'total') {
      console.log('[Parlay] Checking opposing totals:', {
        bet1: { game_id: bet1.game_id, bet_type: bet1.bet_type, line: bet1.line, selection: bet1.selection },
        bet2: { game_id: bet2.game_id, bet_type: bet2.bet_type, line: bet2.line, selection: bet2.selection },
        isSameGame: this.isSameGame(bet1, bet2),
      });
      // Check if same line value but opposite selections
      if (bet1.line !== undefined && bet2.line !== undefined) {
        const sameLine = Math.abs(bet1.line - bet2.line) < 0.01;
        const oppositeSelections = bet1.selection !== bet2.selection;
        console.log('[Parlay] Total check details:', { sameLine, oppositeSelections });
        if (sameLine && oppositeSelections) {
          console.log('[Parlay] ❌ BLOCKING: Opposing totals detected');
          return { valid: false, invalidReason: 'OPPOSING_TOTALS_SAME_GAME' };
        }
      }
    }

    // 8. Opposing spreads (Team A vs Team B on same spread)
    if (bet1.bet_type === 'spread' && bet2.bet_type === 'spread') {
      console.log('[Parlay] Checking opposing spreads:', {
        bet1: { game_id: bet1.game_id, bet_type: bet1.bet_type, selection: bet1.selection, line: bet1.line },
        bet2: { game_id: bet2.game_id, bet_type: bet2.bet_type, selection: bet2.selection, line: bet2.line },
        isSameGame: this.isSameGame(bet1, bet2),
        isSameTeam: this.isSameTeam(bet1, bet2),
      });
      // Check if opposite teams with matching spread values
      if (!this.isSameTeam(bet1, bet2) && bet1.line !== undefined && bet2.line !== undefined) {
        // Spreads are mirror images (e.g., -2.5 and +2.5)
        const mirrorSpreads = Math.abs(Math.abs(bet1.line) - Math.abs(bet2.line)) < 0.01;
        console.log('[Parlay] Spread check details:', {
          bet1Line: bet1.line,
          bet2Line: bet2.line,
          mirrorSpreads,
        });
        if (mirrorSpreads) {
          console.log('[Parlay] ❌ BLOCKING: Opposing spreads detected');
          return { valid: false, invalidReason: 'OPPOSING_SPREADS_SAME_GAME' };
        }
      }
    }

    // 9. 1H spread + game spread (same team)
    if (bet1.bet_type === 'spread' && bet2.bet_type === 'spread') {
      if (this.isSameTeam(bet1, bet2)) {
        if (
          (bet1.period === '1H' && bet2.period === 'FULL') ||
          (bet1.period === 'FULL' && bet2.period === '1H')
        ) {
          return { valid: false, invalidReason: 'PERIOD_SPREAD_AND_GAME_SPREAD' };
        }
      }
    }

    // 7. Team total + alt team total (same team/direction)
    if (bet1.bet_type === 'team_total' && bet2.bet_type === 'team_total') {
      if (this.isSameTeam(bet1, bet2) && bet1.selection === bet2.selection) {
        if (bet1.is_alt_line || bet2.is_alt_line) {
          return { valid: false, invalidReason: 'TEAM_TOTAL_AND_ALT_TEAM_TOTAL' };
        }
      }
    }

    return { valid: true };
  }

  // ==========================================================================
  // SPORT-SPECIFIC RESTRICTIONS
  // ==========================================================================

  private static checkSportSpecificRestrictions(bet1: Bet, bet2: Bet): ValidationResult {
    const sport = bet1.sport_key;

    // NFL specific
    if (sport === 'americanfootball_nfl') {
      return this.checkNFLRestrictions(bet1, bet2);
    }

    // NBA specific
    if (sport === 'basketball_nba') {
      return this.checkNBARestrictions(bet1, bet2);
    }

    // MLB specific
    if (sport === 'baseball_mlb') {
      return this.checkMLBRestrictions(bet1, bet2);
    }

    // NHL & Soccer - only universal restrictions apply
    return { valid: true };
  }

  private static checkNFLRestrictions(bet1: Bet, bet2: Bet): ValidationResult {
    // QB passing yards + same team total Over
    if (bet1.bet_type === 'player_prop' && bet2.bet_type === 'team_total') {
      if (bet1.stat_type === 'passing_yards' && bet2.selection === 'over') {
        const qbTeam = this.extractTeamFromPlayer(bet1);
        const totalTeam = this.extractTeamFromBet(bet2);
        if (qbTeam === totalTeam) {
          return { valid: false, invalidReason: 'NFL_QB_YARDS_AND_TEAM_TOTAL_OVER' };
        }
      }
    }
    // Check reverse
    if (bet2.bet_type === 'player_prop' && bet1.bet_type === 'team_total') {
      if (bet2.stat_type === 'passing_yards' && bet1.selection === 'over') {
        const qbTeam = this.extractTeamFromPlayer(bet2);
        const totalTeam = this.extractTeamFromBet(bet1);
        if (qbTeam === totalTeam) {
          return { valid: false, invalidReason: 'NFL_QB_YARDS_AND_TEAM_TOTAL_OVER' };
        }
      }
    }

    // QB passing TDs + QB passing yards (same player)
    if (this.isSamePlayer(bet1, bet2)) {
      if (
        (bet1.stat_type === 'passing_tds' && bet2.stat_type === 'passing_yards') ||
        (bet1.stat_type === 'passing_yards' && bet2.stat_type === 'passing_tds')
      ) {
        return { valid: false, invalidReason: 'NFL_QB_TDS_AND_YARDS' };
      }
    }

    return { valid: true };
  }

  private static checkNBARestrictions(bet1: Bet, bet2: Bet): ValidationResult {
    // Player points + same player alt points
    if (this.isSamePlayer(bet1, bet2)) {
      if (bet1.stat_type === 'points' && bet2.stat_type === 'points') {
        if (bet1.is_alt_line || bet2.is_alt_line) {
          return { valid: false, invalidReason: 'NBA_PLAYER_POINTS_AND_ALT_POINTS' };
        }
      }
    }

    // 1Q spread + game spread (same team)
    if (bet1.bet_type === 'spread' && bet2.bet_type === 'spread') {
      if (this.isSameTeam(bet1, bet2)) {
        if (
          (bet1.period === '1Q' && bet2.period === 'FULL') ||
          (bet1.period === 'FULL' && bet2.period === '1Q')
        ) {
          return { valid: false, invalidReason: 'NBA_1Q_SPREAD_AND_GAME_SPREAD' };
        }
      }
    }

    return { valid: true };
  }

  private static checkMLBRestrictions(bet1: Bet, bet2: Bet): ValidationResult {
    // Pitcher K's Over + game total Under
    if (
      (bet1.bet_type === 'player_prop' && bet1.stat_type === 'strikeouts' && bet1.selection === 'over' &&
       bet2.bet_type === 'total' && bet2.selection === 'under') ||
      (bet2.bet_type === 'player_prop' && bet2.stat_type === 'strikeouts' && bet2.selection === 'over' &&
       bet1.bet_type === 'total' && bet1.selection === 'under')
    ) {
      return { valid: false, invalidReason: 'MLB_PITCHER_KS_OVER_AND_TOTAL_UNDER' };
    }

    // Team ML + team run line
    if (this.isSameTeam(bet1, bet2)) {
      if (
        (bet1.bet_type === 'moneyline' && bet2.bet_type === 'run_line') ||
        (bet1.bet_type === 'run_line' && bet2.bet_type === 'moneyline')
      ) {
        return { valid: false, invalidReason: 'MLB_TEAM_ML_AND_RUN_LINE' };
      }
    }

    return { valid: true };
  }

  // ==========================================================================
  // NY STATE RESTRICTIONS
  // ==========================================================================

  private static isNYStateRestricted(bet: Bet): boolean {
    // Block ALL college player props
    if (this.isCollegeSport(bet) && bet.bet_type === 'player_prop') {
      return true;
    }

    // Block NY college teams
    if (this.isCollegeSport(bet)) {
      return this.isNYCollegeTeam(bet.teams);
    }

    return false;
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  private static detectParlayType(bets: Bet[]): ParlayType {
    if (bets.length === 1) return ParlayType.SINGLE_BET;

    const firstGameId = bets[0].game_id;
    const allSameGame = bets.every(bet => bet.game_id === firstGameId);

    return allSameGame ? ParlayType.SAME_GAME_PARLAY : ParlayType.REGULAR_PARLAY;
  }

  public static isSameGame(bet1: Bet, bet2: Bet): boolean {
    return bet1.game_id === bet2.game_id;
  }

  public static isSameTeam(bet1: Bet, bet2: Bet): boolean {
    return bet1.selection === bet2.selection && this.isSameGame(bet1, bet2);
  }

  public static isSamePlayer(bet1: Bet, bet2: Bet): boolean {
    if (!bet1.player_name || !bet2.player_name) return false;
    return bet1.player_name === bet2.player_name;
  }

  private static isDuplicateSelection(bet1: Bet, bet2: Bet): boolean {
    // Check if both bets are for the same game, market, selection, and line
    return (
      bet1.game_id === bet2.game_id &&
      bet1.bet_type === bet2.bet_type &&
      bet1.selection === bet2.selection &&
      bet1.line === bet2.line
    );
  }

  public static isCollegeSport(bet: Bet): boolean {
    const collegeSports = [
      'basketball_ncaab',
      'americanfootball_ncaaf',
      'baseball_ncaa',
      'icehockey_ncaa',
    ];
    return collegeSports.includes(bet.sport_key);
  }

  public static isNYCollegeTeam(teamName: string): boolean {
    return NY_COLLEGE_TEAMS.some(blockedTeam =>
      teamName.toLowerCase().includes(blockedTeam.toLowerCase())
    );
  }

  private static extractTeamFromPlayer(bet: Bet): string | null {
    // Player name format might include team, e.g., "Patrick Mahomes (KC)"
    // Or we might need to parse from teams field
    // For now, return null - would need actual data structure
    return null;
  }

  private static extractTeamFromBet(bet: Bet): string | null {
    // Extract team from teams field "Away @ Home" based on selection
    if (!bet.teams) return null;
    const [away, home] = bet.teams.split(' @ ');
    return bet.selection === 'home' ? home : away;
  }

  // ==========================================================================
  // RESTRICTION LOGGING
  // ==========================================================================

  private static async logRestriction(rule: string, sport: string, betCount: number): Promise<void> {
    try {
      const log: RestrictionLog = {
        timestamp: new Date().toISOString(),
        rule,
        sport,
        betCount,
      };

      const existingLogs = await AsyncStorage.getItem(this.RESTRICTION_LOG_KEY);
      const logs: RestrictionLog[] = existingLogs ? JSON.parse(existingLogs) : [];

      logs.push(log);

      // Keep only last 1000 logs
      if (logs.length > 1000) {
        logs.shift();
      }

      await AsyncStorage.setItem(this.RESTRICTION_LOG_KEY, JSON.stringify(logs));
      console.log('[Parlay] Restriction logged:', log);
    } catch (error) {
      console.error('[Parlay] Error logging restriction:', error);
    }
  }

  /**
   * Get restriction analytics (for future dashboard)
   */
  public static async getRestrictionStats(): Promise<Record<string, number>> {
    try {
      const existingLogs = await AsyncStorage.getItem(this.RESTRICTION_LOG_KEY);
      if (!existingLogs) return {};

      const logs: RestrictionLog[] = JSON.parse(existingLogs);

      const stats: Record<string, number> = {};
      logs.forEach(log => {
        stats[log.rule] = (stats[log.rule] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('[Parlay] Error getting restriction stats:', error);
      return {};
    }
  }

  /**
   * Clear restriction logs
   */
  public static async clearRestrictionLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.RESTRICTION_LOG_KEY);
      console.log('[Parlay] Restriction logs cleared');
    } catch (error) {
      console.error('[Parlay] Error clearing restriction logs:', error);
    }
  }
}

export default ParlayValidationService;
