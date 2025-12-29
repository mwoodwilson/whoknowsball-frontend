# CLAUDE.md - Frontend (WhoKnowsBall)

> This file provides comprehensive context for Claude Code and any Task() clones.
> Last updated: 2025-12-14

---

<!-- SHARED CONTEXT START -->

## 1. Project Overview

**WhoKnowsBall** is a sports betting skill-tracking app that calculates a proprietary **BKS (Ball Knowing Score)** for each bet. Users don't wager real money - instead, the app measures betting skill through the BKS algorithm.

### Core Value Proposition
- Quantify betting skill objectively (not just win/loss)
- Social competition via leaderboards
- Track improvement over time
- No real money = no gambling regulations

### Architecture
```
┌─────────────────────┐     ┌─────────────────────┐
│   React Native App  │────▶│   Node.js Backend   │
│   (WhoKnowsBall)    │     │   (bks-backend)     │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌───────────┐      ┌───────────┐      ┌───────────┐
            │ Supabase  │      │   Redis   │      │ External  │
            │ (Postgres)│      │  (Cache)  │      │   APIs    │
            └───────────┘      └───────────┘      └───────────┘
```

### Repository Locations
- **Frontend**: `~/WhoKnowsBall` (symlink to `~/Documents/WhoKnowsBall`)
- **Backend**: `~/bks-backend` (symlink to `~/Documents/bks-backend`)

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.82.0 | Cross-platform mobile |
| TypeScript | 5.8.3 | Type safety |
| Redux Toolkit | 2.9.0 | State management |
| React Navigation | 7.x | Navigation |
| Supabase JS | 2.76.0 | Auth client |
| Axios | 1.12.2 | HTTP client |
| MMKV | 3.3.3 | Fast key-value storage |
| Skia | 2.3.14 | Charts/visualizations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| Express | 4.x | HTTP framework |
| TypeScript | 5.3 | Type safety |
| Supabase JS | 2.74.0 | Database client |
| Redis | 5.8.3 | Caching |

### External APIs
| API | Purpose | Rate Limit |
|-----|---------|------------|
| **API-Sports** (PRIMARY) | Game data & scores | 7,500/day per sport |
| **The Odds API** (SECONDARY) | Betting odds | ~1,613/day |

## 3. API Contracts

### 3.1 Authentication Endpoints

```
POST /api/v1/auth/register
  Request: { email, password, username }
  Response: { success, message, user: { id, email, username } }
  Errors: 400 (validation), 409 (exists)

POST /api/v1/auth/login
  Request: { email, password } (email can be username)
  Response: { success, session: { access_token, refresh_token, expires_at }, user }
  Errors: 401 (invalid), 403 (suspended)

POST /api/v1/auth/refresh
  Request: { refresh_token }
  Response: { access_token, refresh_token, expires_at }

POST /api/v1/auth/logout
  Headers: Authorization: Bearer <token>
  Response: { success: true }
```

### 3.2 Betting Endpoints

```
POST /api/v1/bets/calculate
  Description: Calculate BKS without placing bet
  Auth: Not required
  Request: {
    bet_id, game_id, sport_key, status,
    market: { key: "h2h"|"spreads"|"totals", type: "2way"|"3way" },
    selection: "home"|"away"|"draw"|"over"|"under",
    odds: <american>, stake, stakePercentile, context
  }
  Response: { bks: 0-100, status, version: "3.4.0" }

POST /api/v1/bets
  Description: Place bet (single or parlay)
  Auth: Required
  Request (single): { game_id, sport_key, bet_type, market_type, selection, team, odds, stake }
  Request (parlay): { bet_type: "parlay", stake, legs: [...] }
  Response: { success, bet_id, bks_provisional, status, placed_at }
  Errors: 400, 401, 404 (game), 409 (duplicate within 5min)

GET /api/v1/bets
  Auth: Required
  Query: ?status=PENDING,LIVE,SETTLED&limit=50&offset=0
  Response: { bets: [...], total, hasMore }

GET /api/v1/bets/:betId
  Auth: Required
  Response: { bet: {...} }
```

### 3.3 Odds & Games Endpoints

```
GET /api/v1/odds/:sport
  Params: sport = americanfootball_nfl | basketball_nba | icehockey_nhl | baseball_mlb
  Response: { sport, games: [...], updated_at }

GET /api/v1/odds/upcoming/all
  Query: ?hours=24
  Response: { games: [...], by_sport: {...} }

GET /api/v1/games/:sport
  Response: { games: [...] }
```

### 3.4 Leaderboard & Stats Endpoints

```
GET /api/v1/leaderboard/global
  Query: ?limit=100&offset=0
  Response: { leaderboard: [{ rank, username, overall_bks, total_bets, win_rate }], updated_at }

GET /api/v1/leaderboard/sport/:sportKey
  Response: { leaderboard: [...] }

GET /api/v1/leaderboard/stats/user/:username
  Response: { user: {...}, by_sport: {...}, recent_bets: [...] }

GET /api/v1/leaderboard/users/stats
  Auth: Required
  Response: { user stats for current user }

GET /api/v1/leaderboard/users/bks-history
  Auth: Required
  Query: ?days=30 (0=all time, 1-365 supported)
  Response: { history: [{ date, bks }] }

GET /api/v1/metrics/activity
  Auth: Required
  Query: ?days=30
  Response: { history: [...], summary: {...} }
```

### 3.5 Health & Admin Endpoints

```
GET /health
  Auth: API Key required
  Response: { status: "healthy", timestamp, version }

GET /api/v1/health
  Auth: API Key required
  Response: { status, services: { database, redis, api_sports, odds_api } }

GET /api/v1/jobs/closing-odds/status
POST /api/v1/jobs/closing-odds/start
POST /api/v1/jobs/closing-odds/stop
POST /api/v1/jobs/closing-odds/run-now
```

### 3.6 User & Account Endpoints

```
GET /api/v1/users/profile
  Auth: Required
  Response: { success, profile: { id, username, email, full_name, phone, date_of_birth, overall_bks, total_bets, created_at } }
  Note: Filters deleted accounts

PUT /api/v1/users/profile
  Auth: Required
  Request: { full_name?, phone?, date_of_birth? }
  Response: { success, profile: {...} }
  Validation: date_of_birth=YYYY-MM-DD, phone=10-15 digits

PUT /api/v1/users/email
  Auth: Required
  Request: { new_email }
  Response: { success, message: "Verification email sent..." }
  Errors: 409 (email exists)

DELETE /api/v1/users/account
  Auth: Required
  Request: { confirmation: "DELETE" }
  Response: { deleted: true, message }
  Note: Soft delete - anonymizes PII, sets deleted_at

PUT /api/v1/auth/password
  Auth: Required
  Request: { current_password, new_password }
  Response: { success, message }
  Validation: 8+ chars, letter, number

POST /api/v1/auth/2fa/enable
  Auth: Required
  Response: { success, enabled: true, message: "Code sent to email" }
  Note: Stores code in Redis (5min TTL)

POST /api/v1/auth/2fa/disable
  Auth: Required
  Request: { code }
  Response: { success, enabled: false }

POST /api/v1/auth/2fa/verify
  Auth: Not required (login flow)
  Request: { email, code }
  Response: { success, verified, session: {...} }

POST /api/v1/support/contact
  Auth: Required
  Request: { subject, message }
  Response: { success, ticket_id, message }
  Rate Limit: 5/hour per user
  Subjects: "Bug Report" | "Feature Request" | "Account Issue" | "General Question" | "Other"

GET /api/v1/support/status
  Auth: Required
  Response: { success, email_configured, rate_limit: {...} }
```

## 4. Database Schema

### Core Tables

```sql
-- users: User profiles with BKS stats
users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  overall_bks DECIMAL(5,1) DEFAULT 50.0,
  total_bets INTEGER DEFAULT 0,
  total_won INTEGER DEFAULT 0,
  total_lost INTEGER DEFAULT 0,
  total_push INTEGER DEFAULT 0,
  email_verified BOOLEAN,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(32),
  deleted_at TIMESTAMPTZ,  -- Soft delete timestamp
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- games: Sports games from API-Sports
games (
  id VARCHAR(255) PRIMARY KEY,  -- API-Sports game ID
  sport_key VARCHAR(50) NOT NULL,
  home_team VARCHAR(255) NOT NULL,
  away_team VARCHAR(255) NOT NULL,
  commence_time TIMESTAMPTZ NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  status VARCHAR(20) DEFAULT 'upcoming',  -- upcoming, live, completed
  completed BOOLEAN DEFAULT FALSE,
  odds_api_event_id VARCHAR(255)  -- Cross-reference to Odds API
)

-- bets: User bets with BKS components
bets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_id VARCHAR(255) REFERENCES games(id),
  sport_key VARCHAR(50) NOT NULL,
  bet_type VARCHAR(20) NOT NULL,  -- moneyline, spread, total, parlay
  market_type VARCHAR(10) NOT NULL,  -- 2way, 3way
  selection VARCHAR(20) NOT NULL,  -- home, away, draw, over, under
  team VARCHAR(255),
  line DECIMAL(5,1),
  odds INTEGER NOT NULL,
  stake DECIMAL(10,2) NOT NULL,
  bks_provisional DECIMAL(5,1),
  bks_final DECIMAL(5,1),
  status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, LIVE, SETTLING, SETTLED, VOID
  outcome VARCHAR(10),  -- WIN, LOSS, PUSH, VOID
  placed_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ
)

-- parlay_legs: Individual legs for parlay bets
parlay_legs (
  id UUID PRIMARY KEY,
  bet_id UUID REFERENCES bets(id),
  game_id VARCHAR(255) REFERENCES games(id),
  leg_number INTEGER NOT NULL,
  sport_key VARCHAR(50),
  bet_type VARCHAR(20),
  selection VARCHAR(20),
  team VARCHAR(255),
  line DECIMAL(5,1),
  odds INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  outcome VARCHAR(10)
)

-- daily_quota_tracking: API usage monitoring
daily_quota_tracking (
  id UUID PRIMARY KEY,
  api_name VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  requests_made INTEGER DEFAULT 0,
  quota_limit INTEGER NOT NULL
)
```

### Row Level Security
- `users`: Anyone can SELECT; users can UPDATE own profile
- `bets`: Users can SELECT/INSERT own bets; service role manages all
- `games`: Public read access (no RLS)

## 5. BKS Algorithm v3.4.0

### Overview
The Ball Knowing Score (BKS) algorithm is a proprietary system that quantifies betting skill on a 0-100 scale.

### Components (Weights Redacted)
The algorithm evaluates bets across six dimensions:
- **Difficulty**: How hard was the bet to win?
- **Complexity**: Parlay vs single bet complexity
- **Payout**: Risk/reward potential
- **Accuracy**: Closing line value
- **Stake**: Conviction measurement
- **Context**: Game importance

### Output
- Score range: 0-100
- Higher scores indicate better betting decisions
- Accounts for both pre-game analysis and outcome

*Full algorithm details redacted for IP protection.*
*Contact: matthew.wood.wilson@gmail.com*

## 6. Authentication & Security

### Auth Flow
1. **Email/Password**: Supabase Auth → JWT token
2. **OAuth**: Google/Apple → check username → UsernameSetup if needed
3. **Biometric**: Store credentials in Keychain, prompt on app open
4. **24-hour deadline**: Unverified accounts get restricted after 24h

### Security Principles
- **BKS algorithm NEVER exposed to frontend** - calculation is server-side only
- API key required for ngrok/public access (`X-API-Key` header)
- HMAC-SHA256 signatures on bets for integrity
- Rate limiting: 60 req/min global, 10 req/min for BKS endpoints
- JWT tokens with auto-refresh

## 7. Business Rules

### Parlay Validation (DraftKings-style)
- Max 10 legs (regular parlay)
- Max 10 legs (same-game parlay)
- No opposite moneylines on same game
- No same team ML + spread
- No opposing spreads/totals on same game
- No duplicate selections
- NY state college sport restrictions

### Bet Placement Rules
- Game must exist and not be completed
- Odds must be valid American format (≤-100 or ≥100)
- Stake must be positive
- No duplicate bets within 5 minutes

### Settlement Timing
- Games marked completed when API-Sports returns final
- Settlement job runs every 5 minutes
- Closing odds captured T-2 minutes before commence

## 8. Constraints & Quotas

### NO/LOW COST MVP Requirement
- All services must have free tiers
- Optimize API calls aggressively

### API Quotas
| API | Daily Limit | Strategy |
|-----|-------------|----------|
| API-Sports | 7,500/sport | Primary for games/scores |
| The Odds API | ~1,613 | Secondary for odds only |
| Supabase | Free tier | 500MB database, 2GB bandwidth |
| Redis (Upstash) | 10,000 commands | 60s TTL for odds |

### Frontend Requirements
- 30-second polling for live odds (betting-grade UX)
- Offline-capable for viewing bets/stats
- Biometric auth for quick access

## 9. Development Workflow

### Git Commit Practice
- Commit messages: `type: description` (fix:, feat:, refactor:)
- Include Claude Code footer in commits
- Test before committing

### Testing Requirements
- Unit tests for critical components
- Integration tests for API routes
- 100% test success before commits

<!-- SHARED CONTEXT END -->

---

<!-- ========================================================================== -->
<!-- FRONTEND-SPECIFIC CONTEXT                                                  -->
<!-- ========================================================================== -->

## 10. React Native Setup

### Environment
- Metro bundler with hot reload
- TypeScript strict mode
- iOS: Xcode, CocoaPods
- Android: Android Studio, Gradle

### Key Dependencies
```json
{
  "react": "19.1.1",
  "react-native": "0.82.0",
  "@reduxjs/toolkit": "2.9.0",
  "@react-navigation/native": "7.1.18",
  "@supabase/supabase-js": "2.76.0",
  "axios": "1.12.2",
  "react-native-mmkv": "3.3.3",
  "@shopify/react-native-skia": "2.3.14"
}
```

### Environment Variables (.env)
```
BACKEND_URL=https://xxx.ngrok-free.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=[REDACTED]
API_KEY=[REDACTED]  # X-API-Key for backend auth
```

## 11. Project Structure

```
src/
├── components/
│   ├── Account/              # SettingsSection, SettingsRow, SettingsToggleRow, SettingsDropdownRow
│   ├── Auth/                 # SocialLoginButtons
│   ├── BetSlip/              # BetSlip, BetSlipBar, BetSlipMockReference
│   ├── GameCard/             # Game display with odds
│   ├── MyBKS/                # BKSCircularCard, BKSLineChart, MetricsCards, SportPerformanceChart, TimeFrameSelector
│   ├── SearchBar/            # Game search
│   ├── SportSelector/        # Sport filter toggles
│   ├── Typography/           # Text components
│   ├── VerificationBanner/   # Email verification reminder
│   └── VerificationRequiredModal/
├── constants/
│   └── leagueLogos.ts        # League badge URLs and emoji fallbacks
├── screens/
│   ├── Account/              # EditProfileField, EditEmail, ChangePassword, TwoFactorAuth, ContactSupport, DeleteAccount
│   ├── Auth/                 # Login, Register, UsernameSetup, ForgotPassword, PasswordReset, AccountDisabled
│   ├── Home/                 # HomeScreen (game browser)
│   ├── MyBets/               # MyBetsScreen (active/settled)
│   ├── MyBKS/                # MyBKSScreen (stats dashboard)
│   ├── AccountScreen.tsx     # Main account/settings screen
│   └── Legal/                # TOS, Privacy
├── services/
│   ├── api/
│   │   ├── BackendAPIService.ts    # Backend HTTP client
│   │   └── connectionTest.ts       # API connection testing
│   ├── auth/
│   │   └── SupabaseAuthService.ts  # Supabase auth
│   ├── cache/
│   │   └── CacheService.ts         # MMKV-based logo caching
│   ├── parlay/
│   │   └── ParlayValidationService.ts  # Parlay rules
│   └── OddsAPIService.ts
├── store/
│   ├── index.ts              # Redux store config
│   └── slices/
│       ├── userSlice.ts      # User state
│       ├── betsSlice.ts      # Bets state
│       ├── gamesSlice.ts     # Games state
│       └── uiSlice.ts        # UI state
├── contexts/
│   └── AuthContext.tsx       # Auth state & methods
├── hooks/
│   ├── useBiometricAuth.ts
│   ├── useEmailValidation.ts
│   ├── useUsernameValidation.ts
│   ├── useVerificationDeadline.ts
│   └── useVerificationToast.tsx    # Verification toast notifications
├── navigation/
│   ├── RootNavigator.tsx     # Root stack
│   └── TabNavigator.tsx      # Bottom tabs
├── theme/
│   ├── colors.ts             # TealPine palette
│   ├── globalStyles.ts       # Global StyleSheet definitions
│   └── typography.ts         # Typography system (fonts, text styles)
├── utils/
│   └── fuzzyMatch.ts         # Search utilities for game/team filtering
└── types/
```

## 12. UI/UX - TealPine Design System

### Color Palette
```typescript
export const TealPineColors = {
  // Backgrounds
  background: '#0C1412',           // Primary pine
  backgroundSecondary: '#0E1715',  // Secondary
  surface: '#101D1A',              // Card surfaces
  border: '#0F2A27',               // Borders

  // Brand
  primary: '#00B3A4',              // Teal accent
  accent: '#34D399',               // Bright green

  // Text
  textPrimary: '#E9F3F1',          // Light text
  textSecondary: '#93A7A3',        // Muted text

  // Status
  win: '#22C55E',                  // Green
  loss: '#F43F5E',                 // Red
  warning: '#EAB308',              // Yellow
  info: '#14B8A6',                 // Info teal
};

export const borderRadius = 12;
```

### Design Principles
- Dark mode first
- No 90° corners (always rounded)
- Minimal gradients
- High contrast for accessibility

## 13. State Management (Redux)

### Store Structure
```typescript
interface RootState {
  user: { username, overallBKS, rank, isAuthenticated };
  bets: { activeBets, settledBets, loading };
  games: { todayGames, liveGames, loading };
  ui: { isAuthModalVisible, selectedSport, refreshing };
}
```

### Slices
- `userSlice`: User profile and auth state
- `betsSlice`: Active/settled bets
- `gamesSlice`: Games data
- `uiSlice`: UI state (modals, filters)

## 14. Navigation Structure

```
RootNavigator (Stack)
├── MainApp (Bottom Tabs)
│   ├── Home         → HomeScreen
│   ├── MyBets       → MyBetsScreen
│   ├── Leaderboard  → LeaderboardPlaceholder
│   ├── MyBKS        → MyBKSScreen
│   └── Account      → AccountScreen
├── Login (modal)
├── Register (modal)
├── UsernameSetup (modal, non-dismissible)
├── ForgotPassword (modal)
├── PasswordReset (modal)
├── AccountDisabled (modal)  # Shown to suspended users
├── TermsOfService (modal)
└── PrivacyPolicy (modal)
```

## 15. API Service Layer

### BackendAPIService.ts
```typescript
class BackendAPIService {
  private baseURL = Config.BACKEND_URL;

  async calculateBKS(betData) → { bks, status, version }
  async getGames(sport) → games[]
  async getUserBets() → bets[]
  async placeBet(betData) → { bet_id, bks_provisional }
  async getUserStats() → stats
  async getUserBKSHistory(days) → history[]  // days=0 for all time

  private async getHeaders() → {
    Authorization: Bearer <token>,
    'X-API-Key': API_KEY,
    'ngrok-skip-browser-warning': 'true'
  }
}
```

## 16. Development Commands

```bash
npm start              # Start Metro bundler
npm run ios            # Build & run iOS
npm run android        # Build & run Android
cd ios && pod install  # Install iOS deps
npm test               # Run tests
npm run lint           # Lint check
```

## 17. Common Issues & Solutions

1. **Metro bundler stuck**: `npx react-native start --reset-cache`
2. **iOS build fails**: `cd ios && pod install --repo-update`
3. **ngrok URL changed**: Update `BACKEND_URL` in `.env`
4. **Odds not loading**: Check backend is running, ngrok is active
5. **Auth token expired**: Check AuthContext auto-refresh logic

## 18. Utilities

### fuzzyMatch.ts
Search utilities for filtering games and teams:
- `fuzzyMatch(query, target)` - Basic fuzzy string matching
- `matchesTeam(query, game)` - Match search against home/away teams
- `getMatchScore(query, target)` - Score matches for ranking (0-100)
- `getTeamMatchScore(query, game)` - Best match score between teams
- `matchesSport(query, sport)` - Match sport names with abbreviation handling

## 19. Constants

### leagueLogos.ts
League information and badge URLs:
- `LEAGUE_LOGOS` object mapping sport keys to league info
- Includes TheSportsDB badge URLs for major leagues
- Emoji fallbacks for NCAAF/NCAAB
- `getLeagueInfo(sportKey)` helper function

## 20. Cache Service

### CacheService.ts
MMKV-based caching for team logos with TTL management:
- `getCachedLogo(teamKey)` - Retrieve cached logo URL
- `setCachedLogo(teamKey, url, ttl)` - Cache logo with TTL
- `clearExpiredCache()` - Remove expired entries
- Default TTL: 24 hours
