# WhoKnowsBall - Product Requirements Document

**Version:** 2.0
**Last Updated:** 2025-11-30
**Status:** Production
**Classification:** Internal

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [BKS Algorithm Specification](#4-bks-algorithm-specification)
5. [Database Schema](#5-database-schema)
6. [Appendices](#6-appendices)

---

# 1. Executive Summary

This document outlines the frontend product specifications and requirements for a free, no-cost sports betting app called "WhoKnowsBall", centered around a proprietary metric called "Ball Knowing Score" which grades a user based on their sports betting skill. No metric currently exists that provides this type of grading for sports bettors, indicating a significant market gap in an [industry currently valued at ~$100B, and predicted to grow to $187B by 2030](https://www.grandviewresearch.com/industry-analysis/sports-betting-market-report). Ball Knowing Score allows users to effectively compete with their friends and family and prove their "ball knowledge", fulfilling a [top motivator for participation in the sports betting industry.](https://www.sportsbettingdime.com/guides/research/survey-sports-betting-motivations/)

## 1.1 Product Vision

**WhoKnowsBall** is a gamified sports betting and skill-tracking platform that quantifies betting acumen through a proprietary scoring algorithm. This algorithm generates a BKS, or "Ball Knowing Score", designed to measure a sports bettors bet quality and skill. Unlike traditional sportsbooks, users don't wager real money—instead, they compete via a leaderboard tracking **Ball Knowing Score (BKS)**.

## 1.2 Problem Statement

Sports bettors lack an objective metric to evaluate their betting skill independent of variance and bankroll fluctuations. The two metrics most consistently cited, Win/loss records and ROI, fail to capture:
- Bet difficulty (underdog vs. favorite)
- Market timing (closing line value)
- Risk-adjusted returns
- Bet complexity (parlays, props)

## 1.3 Solution

WhoKnowsBall introduces a deterministic scoring system that evaluates every bet across six weighted dimensions, producing a 0-100 BKS score that reflects true betting skill rather than luck.

## 1.4 Target Users

| Segment | Description | Primary Use Case |
|---------|-------------|------------------|
| **Recreational Bettors** | Casual fans who bet for entertainment | Track skill improvement over time |
| **Sharp Bettors** | Experienced bettors seeking edge validation | Quantify CLV and betting efficiency |
| **Fantasy Players** | DFS/fantasy sports enthusiasts | Apply analytical skills to spread betting |
| **Sports Analysts** | Media personalities, podcasters | Prove predictive accuracy publicly |

## 1.5 Key Metrics

| Metric | Target | Current |
|--------|--------|---------|
| DAU/MAU Ratio | >25% | TBD |
| Bets per User per Week | >5 | TBD |
| 7-Day Retention | >40% | TBD |
| NPS Score | >50 | TBD |

## 1.6 Competitive Landscape

| Competitor | Model | Differentiation |
|------------|-------|-----------------|
| **Action Network** | Tracking + content | No skill scoring |
| **Pikkit** | Social betting | Simple win/loss tracking |
| **Tallysight** | Expert tracking | Media-focused, no consumer app |
| **WhoKnowsBall** | Skill quantification | Deterministic BKS algorithm |

## 1.7 Technical Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React Native 0.82 (iOS/Android)             │    │
│  │  TypeScript │ Redux Toolkit │ React Navigation │ Skia   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    ngrok (Development)                   │    │
│  │              TLS Termination │ Rate Limiting             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Node.js + Express + TypeScript              │    │
│  │     BKS Calculator │ Job Scheduler │ Auth Middleware     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Supabase     │ │     Redis       │ │  External APIs  │
│   (PostgreSQL)  │ │    (Cache)      │ │                 │
│                 │ │                 │ │  • API-Sports   │
│  • Users        │ │  • Leaderboards │ │  • The Odds API │
│  • Games        │ │  • Rate Limits  │ │                 │
│  • Bets         │ │  • Sessions     │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

# 2. Frontend Architecture

## 2.1 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React Native | 0.82.0 | Cross-platform mobile |
| Language | TypeScript | 5.8.3 | Type safety |
| Navigation | React Navigation | 7.x | Stack + Tab navigation |
| State | Redux Toolkit | 2.9.0 | Global state management |
| Auth | Supabase JS | 2.76.0 | Authentication |
| Animations | Reanimated | 3.19.3 | 60fps animations |
| Graphics | Skia | 2.3.14 | Charts, visualizations |
| Storage | MMKV | 3.3.3 | Fast key-value storage |

## 2.2 Project Structure

```
src/
├── components/                    # Reusable UI components
│   ├── Auth/
│   │   └── SocialLoginButtons.tsx
│   ├── BetSlip/
│   │   ├── BetSlip.tsx           # Main bet slip bottom sheet
│   │   └── BetSlipBar.tsx        # Floating bet count bar
│   ├── GameCard/
│   │   └── GameCard.tsx          # Game display with odds
│   ├── MyBKS/
│   │   ├── BKSCircularCard.tsx   # Circular score display
│   │   ├── BKSLineChart.tsx      # 30-day history chart
│   │   ├── MetricsCards.tsx      # Win rate, totals
│   │   └── SportPerformanceChart.tsx
│   └── Typography/
│       └── index.tsx             # H1, H2, Label components
│
├── screens/                       # Full-screen views
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── UsernameSetupScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── AccountDisabledScreen.tsx
│   ├── Home/
│   │   └── HomeScreen.tsx        # Game browser + bet placement
│   ├── MyBets/
│   │   └── MyBetsScreen.tsx      # Active/Settled tabs
│   ├── MyBKS/
│   │   └── MyBKSScreen.tsx       # BKS dashboard
│   └── Legal/
│       ├── TermsOfServiceScreen.tsx
│       └── PrivacyPolicyScreen.tsx
│
├── services/                      # API & business logic
│   ├── api/
│   │   └── BackendAPIService.ts  # HTTP client for backend
│   ├── auth/
│   │   └── SupabaseAuthService.ts
│   ├── parlay/
│   │   └── ParlayValidationService.ts  # 600+ lines of rules
│   ├── cache/
│   │   └── CacheService.ts
│   └── OddsAPIService.ts
│
├── store/                         # Redux configuration
│   ├── index.ts                  # Store setup
│   └── slices/
│       ├── uiSlice.ts            # UI state (modals, filters)
│       ├── betsSlice.ts          # Active/settled bets
│       ├── gamesSlice.ts         # Games data
│       └── userSlice.ts          # User profile
│
├── contexts/
│   └── AuthContext.tsx           # Auth state & methods
│
├── hooks/
│   ├── useBiometricAuth.ts
│   ├── useEmailValidation.ts
│   ├── useUsernameValidation.ts
│   └── useVerificationDeadline.ts
│
├── navigation/
│   └── RootNavigator.tsx
│
├── theme/
│   └── colors.ts                 # TealPine palette
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
└── utils/
    └── fuzzyMatch.ts             # Search matching
```

## 2.3 Navigation Architecture

```
RootNavigator (Stack.Navigator)
│
├─► MainApp (Tab.Navigator)
│   │
│   ├─► Home Tab
│   │   └── HomeScreen
│   │       ├── SportSelector (horizontal scroll)
│   │       ├── SearchBar
│   │       ├── SectionList (grouped by sport)
│   │       │   └── GameCard (per game)
│   │       │       ├── Team logos + names
│   │       │       ├── Live score (if in-progress)
│   │       │       ├── OddsButton × 6 (ML, Spread, Total)
│   │       │       └── Flash animation on odds change
│   │       └── BetSlipBar (floating)
│   │           └── BetSlip (bottom sheet modal)
│   │
│   ├─► MyBets Tab
│   │   └── MyBetsScreen
│   │       ├── Tab: Active (PENDING, LIVE)
│   │       └── Tab: Settled (WIN, LOSS, PUSH)
│   │
│   ├─► Leaderboard Tab (placeholder)
│   │
│   ├─► MyBKS Tab
│   │   └── MyBKSScreen
│   │       ├── BKSCircularCard (overall score)
│   │       ├── MetricsCards (win rate, avg BKS)
│   │       ├── BKSLineChart (30-day trend)
│   │       └── SportPerformanceChart (bar chart)
│   │
│   └─► Account Tab (placeholder)
│
├─► Login (modal, gesture-enabled)
├─► Register (modal, gesture-enabled)
├─► UsernameSetup (modal, non-dismissible)
├─► ForgotPassword (modal)
├─► PasswordReset (modal, non-dismissible)
├─► TermsOfService (modal)
└─► PrivacyPolicy (modal)
```

## 2.4 Design System: TealPine Theme

### 2.4.1 Color Palette

```typescript
export const TealPineColors = {
  // Backgrounds (Pine greens)
  background: '#0C1412',           // Primary - deep pine
  backgroundSecondary: '#0E1715',  // Cards, surfaces
  surface: '#101D1A',              // Elevated surfaces
  surfaceHover: '#152622',         // Interactive hover state

  // Brand colors
  primary: '#00B3A4',              // Teal - primary actions
  primaryDark: '#008F82',          // Pressed state
  accent: '#34D399',               // Bright green - highlights

  // Text hierarchy
  textPrimary: '#E9F3F1',          // Primary text - high contrast
  textSecondary: '#93A7A3',        // Secondary - muted
  textTertiary: '#5C706C',         // Disabled, hints
  textInverse: '#0C1412',          // On light backgrounds

  // Semantic colors
  win: '#22C55E',                  // Success green
  winBackground: 'rgba(34, 197, 94, 0.15)',
  loss: '#F43F5E',                 // Error red
  lossBackground: 'rgba(244, 63, 94, 0.15)',
  warning: '#EAB308',              // Warning yellow
  info: '#14B8A6',                 // Info teal

  // Borders & Dividers
  border: '#0F2A27',               // Subtle borders
  borderFocus: '#00B3A4',          // Focus rings
  divider: '#1A2926',              // Section dividers

  // Odds button states
  oddsDefault: '#152622',
  oddsSelected: '#00B3A4',
  oddsFlash: '#34D399',            // Odds change animation
};

// Spacing scale (4px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Border radius
export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
};

// Typography
export const Typography = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 0.5 },
};
```

### 2.4.2 Component Styling Patterns

```typescript
// GameCard example
const styles = StyleSheet.create({
  container: {
    backgroundColor: TealPineColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    ...Typography.body,
    color: TealPineColors.textPrimary,
    flex: 1,
  },
  oddsButton: {
    backgroundColor: TealPineColors.oddsDefault,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 70,
    alignItems: 'center',
  },
  oddsButtonSelected: {
    backgroundColor: TealPineColors.oddsSelected,
  },
  oddsText: {
    ...Typography.bodySmall,
    color: TealPineColors.textPrimary,
    fontWeight: '600',
  },
  liveIndicator: {
    backgroundColor: TealPineColors.loss,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  liveText: {
    ...Typography.caption,
    color: TealPineColors.textPrimary,
    fontWeight: '700',
  },
});
```

## 2.5 State Management

### 2.5.1 Redux Store Structure

```typescript
interface RootState {
  ui: {
    isAuthModalVisible: boolean;
    selectedSport: string | null;
    refreshing: boolean;
    betSlipOpen: boolean;
  };
  bets: {
    activeBets: Bet[];
    settledBets: Bet[];
    loading: boolean;
    error: string | null;
  };
  games: {
    byId: Record<string, Game>;
    allIds: string[];
    loading: boolean;
  };
  user: {
    profile: UserProfile | null;
    stats: UserStats | null;
  };
}

// Async thunks for API calls
const fetchUserBets = createAsyncThunk('bets/fetchUserBets', async () => {
  return await BackendAPIService.getUserBets();
});

const placeBet = createAsyncThunk('bets/placeBet', async (betData: BetInput) => {
  return await BackendAPIService.placeBet(betData);
});
```

### 2.5.2 AuthContext API

```typescript
interface AuthContextValue {
  // State
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  accountExpired: boolean;

  // Methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

## 2.6 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. EMAIL/PASSWORD REGISTRATION
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Register │────▶│ Validate │────▶│ Supabase │────▶│  Verify  │
   │  Screen  │     │  Input   │     │  signUp  │     │  Email   │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
        │                                                   │
        │ Validations:                                      │
        │ • Email format                                    │
        │ • Username 3-50 chars, alphanumeric + underscore  │
        │ • Password 8+ chars, uppercase, number, symbol    │
        │ • Username uniqueness (async API check)           │
        │                                                   ▼
        │                                            ┌──────────┐
        │                                            │  24-hour │
        │                                            │ deadline │
        └────────────────────────────────────────────┴──────────┘

2. OAUTH (Google/Apple)
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Social  │────▶│ Provider │────▶│ Callback │────▶│ Username │
   │  Button  │     │  OAuth   │     │  Handler │     │  Setup?  │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
        │                                                   │
        │ Deep link: whoknowsball://auth/callback           │
        │                                                   ▼
        │                                         ┌─────────────────┐
        │                                         │ If no username: │
        │                                         │ UsernameSetup   │
        │                                         │ (non-dismissible)│
        └─────────────────────────────────────────┴─────────────────┘

3. BIOMETRIC (Face ID / Touch ID)
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │   App    │────▶│ Keychain │────▶│ Supabase │────▶│  MainApp │
   │  Launch  │     │   Read   │     │  signIn  │     │          │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
        │                │
        │                │ On first manual login:
        │                │ • Prompt to enable biometric
        │                │ • Store credentials in Keychain
        │                │
        ▼                ▼
   ┌────────────────────────────────────┐
   │ useBiometricAuth hook:             │
   │ • isBiometricAvailable             │
   │ • authenticate()                   │
   │ • saveCredentials()                │
   │ • clearCredentials()               │
   └────────────────────────────────────┘

4. EMAIL VERIFICATION ENFORCEMENT
   ┌─────────────────────────────────────────────────────────────┐
   │                                                             │
   │  if (accountCreatedAt + 24h < now && !emailVerified) {      │
   │    • Show VerificationBanner at top of app                  │
   │    • Block access to: Leaderboard, MyBKS tabs               │
   │    • Allow: Home (browse), MyBets (view only)               │
   │    • Block: Bet placement                                   │
   │  }                                                          │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
```

## 2.7 Parlay Validation Rules

```typescript
// ParlayValidationService.ts - Rule Engine

interface ValidationResult {
  isValid: boolean;
  parlayType: 'single' | 'regular' | 'same_game';
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Universal Restrictions (all parlays)
const UNIVERSAL_RULES = [
  'NO_OPPOSITE_MONEYLINES',      // Can't bet both teams ML same game
  'NO_SAME_TEAM_ML_AND_SPREAD',  // Can't combine ML + spread same team
  'NO_OPPOSING_SPREADS',         // Can't bet both spreads same game
  'NO_OPPOSING_TOTALS',          // Can't bet over + under same game
  'NO_DUPLICATE_SELECTIONS',     // Can't repeat exact same bet
];

// Leg Limits
const LEG_LIMITS = {
  SINGLE: 1,
  REGULAR_PARLAY_MAX: 10,
  SAME_GAME_PARLAY_MAX: 10,
  ABSOLUTE_MAX: 12,
};

// Sport-Specific Restrictions
const SPORT_RULES = {
  NFL: {
    maxLegsPerGame: 4,
    allowedMarkets: ['h2h', 'spreads', 'totals'],
    correlationLimit: 0.85,
  },
  NBA: {
    maxLegsPerGame: 6,
    allowedMarkets: ['h2h', 'spreads', 'totals', 'player_props'],
    correlationLimit: 0.80,
  },
  MLB: {
    maxLegsPerGame: 4,
    allowedMarkets: ['h2h', 'spreads', 'totals'],
    correlationLimit: 0.75,
  },
};

// NY State College Sports Restrictions
const NY_COLLEGE_BLOCKED = [
  // All NY-based colleges blocked for props and certain markets
  'Syracuse', 'St. John\'s', 'Buffalo', 'Albany', 'Colgate',
  'Cornell', 'Columbia', 'Fordham', 'Hofstra', 'Iona',
  'Manhattan', 'Marist', 'Niagara', 'Siena', 'Army',
];
```

## 2.8 API Integration Layer

```typescript
// BackendAPIService.ts

class BackendAPIService {
  private static instance: AxiosInstance;

  static init() {
    this.instance = axios.create({
      baseURL: Config.BACKEND_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': Config.API_KEY,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    // Add auth interceptor
    this.instance.interceptors.request.use(async (config) => {
      const session = await SupabaseAuthService.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });

    // Add response interceptor for token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await SupabaseAuthService.refreshSession();
          return this.instance.request(error.config);
        }
        throw error;
      }
    );
  }

  // Bet Operations
  static async placeBet(betData: BetInput): Promise<BetResponse> {
    const response = await this.instance.post('/api/v1/bets', betData);
    return response.data;
  }

  static async getUserBets(): Promise<Bet[]> {
    const response = await this.instance.get('/api/v1/bets');
    return response.data.bets;
  }

  static async calculateBKS(betData: BKSInput): Promise<BKSCalculation> {
    const response = await this.instance.post('/api/v1/bets/calculate', betData);
    return response.data;
  }

  // Game/Odds Operations
  static async getGames(sport?: string): Promise<Game[]> {
    const params = sport ? { sport } : {};
    const response = await this.instance.get('/api/v1/odds/upcoming/all', { params });
    return response.data.games;
  }

  // User Stats
  static async getUserStats(): Promise<UserStats> {
    const session = await SupabaseAuthService.getSession();
    const response = await this.instance.get(`/api/v1/stats/user/${session.user.username}`);
    return response.data;
  }

  static async getBKSHistory(days: number = 30): Promise<BKSHistoryPoint[]> {
    const response = await this.instance.get('/api/v1/metrics/activity', {
      params: { days },
    });
    return response.data.history;
  }
}
```

---

# 3. Backend Architecture

## 3.1 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Runtime | Node.js | 20.x LTS | Server runtime |
| Framework | Express | 4.x | HTTP server |
| Language | TypeScript | 5.3 | Type safety |
| Database | PostgreSQL | 15.x | Primary data store |
| ORM | Supabase JS | 2.x | Database client + Auth |
| Cache | Redis | 7.x | Caching, rate limiting |
| Build | tsx | 4.x | TypeScript execution |

## 3.2 Project Structure

```
src/
├── index.ts                       # Application entry point
│
├── api/
│   └── routes/
│       ├── v1/
│       │   └── auth.routes.ts     # /api/v1/auth/*
│       ├── bks.routes.ts          # /api/v1/bets/* (BKS calculation)
│       ├── bets.routes.ts         # /api/bets/* (legacy)
│       ├── odds.routes.ts         # /api/v1/odds/*
│       ├── leaderboard.routes.ts  # /api/v1/leaderboard/*
│       ├── metrics.routes.ts      # /api/v1/metrics/*
│       ├── search.routes.ts       # /api/v1/search
│       ├── teams.routes.ts        # /api/v1/teams/*
│       ├── jobs.routes.ts         # /api/v1/jobs/* (admin)
│       ├── health.routes.ts       # /health, /api/v1/health
│       └── test.routes.ts         # /api/test/* (dev only)
│
├── config/
│   ├── supabase.ts               # Lazy-loaded Supabase client
│   ├── redis.ts                  # Redis singleton with reconnect
│   ├── apiSportsConfig.ts        # API-Sports endpoints & leagues
│   ├── teamMappings.ts           # Team name normalization
│   └── constants.ts              # App-wide constants
│
├── middleware/
│   ├── auth.middleware.ts        # JWT verification, auto-refresh
│   └── security.middleware.ts    # API key, rate limiting, CORS
│
├── services/
│   ├── bks/
│   │   ├── BKSCalculator.ts      # Core algorithm implementation
│   │   ├── types.ts              # BetData, BKSResult interfaces
│   │   └── OverallBKSService.ts  # User aggregate BKS
│   │
│   ├── jobs/
│   │   ├── GameCreationJob.ts    # Creates games from API-Sports
│   │   ├── OddsMatchingJob.ts    # Matches Odds API to games
│   │   ├── ScoresJob.ts          # Updates live scores
│   │   ├── SettlementJob.ts      # Settles completed bets
│   │   ├── ClosingOddsJob.ts     # Captures pre-game odds
│   │   └── StaleGameDetectionJob.ts
│   │
│   ├── odds/
│   │   ├── OddsAPIService.ts     # The Odds API client
│   │   ├── OddsEnhancementService.ts
│   │   └── ClosingOddsCapture.ts
│   │
│   ├── APISportsService.ts       # API-Sports HTTP client
│   └── DailyBKSService.ts        # Daily BKS snapshots
│
├── utils/
│   ├── gameIdValidation.ts       # ID format validation
│   └── quotaCircuitBreaker.ts    # API quota management
│
└── database/
    └── migrations/
        └── *.sql                 # Database migrations
```

## 3.3 API Specification

### 3.3.1 Authentication Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION API                            │
└─────────────────────────────────────────────────────────────────┘

POST /api/v1/auth/register
  Request:
    {
      "email": "user@example.com",
      "password": "SecureP@ss1",
      "username": "sportsfan123"
    }
  Response: 201 Created
    {
      "success": true,
      "message": "Registration successful. Please verify your email.",
      "user": { "id": "uuid", "email": "...", "username": "..." }
    }
  Errors:
    400 - Validation failed (weak password, invalid email)
    409 - Email or username already exists

POST /api/v1/auth/login
  Request:
    {
      "email": "user@example.com",  // or username
      "password": "SecureP@ss1"
    }
  Response: 200 OK
    {
      "success": true,
      "session": {
        "access_token": "eyJ...",
        "refresh_token": "...",
        "expires_at": 1234567890
      },
      "user": { ... }
    }
  Errors:
    401 - Invalid credentials
    403 - Account suspended (unverified > 24h)

POST /api/v1/auth/oauth
  Request:
    {
      "provider": "google" | "apple",
      "id_token": "...",
      "nonce": "..."
    }
  Response: 200 OK
    {
      "success": true,
      "session": { ... },
      "user": { ... },
      "needs_username": true | false
    }

POST /api/v1/auth/refresh
  Request:
    { "refresh_token": "..." }
  Response: 200 OK
    {
      "access_token": "eyJ...",
      "refresh_token": "...",
      "expires_at": 1234567890
    }

POST /api/v1/auth/logout
  Headers: Authorization: Bearer <token>
  Response: 200 OK
    { "success": true }

GET /api/v1/auth/verify?token=<token_hash>
  Response: 200 OK (HTML page)
    Email verification confirmation page
```

### 3.3.2 Betting Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                       BETTING API                                │
└─────────────────────────────────────────────────────────────────┘

POST /api/v1/bets/calculate
  Description: Calculate BKS for a bet without placing it
  Auth: Not required
  Request:
    {
      "bet_id": "temp-123",
      "game_id": "17496",
      "sport_key": "americanfootball_nfl",
      "status": "PENDING",
      "market": {
        "key": "h2h",
        "type": "2way"
      },
      "selection": "home",
      "odds": -150,
      "stake": 100,
      "stakePercentile": 0.5,
      "context": "regular"
    }
  Response: 200 OK
    {
      "bks": 42.5,
      "status": "PENDING",
      "version": "3.4.0"
    }

POST /api/v1/bets
  Description: Place a bet (single or parlay)
  Auth: Required
  Request (single):
    {
      "game_id": "17496",
      "sport_key": "americanfootball_nfl",
      "bet_type": "moneyline",
      "market_type": "2way",
      "selection": "home",
      "team": "Cleveland Browns",
      "odds": -150,
      "stake": 100
    }
  Request (parlay):
    {
      "bet_type": "parlay",
      "stake": 100,
      "legs": [
        {
          "game_id": "17496",
          "sport_key": "americanfootball_nfl",
          "bet_type": "moneyline",
          "selection": "home",
          "team": "Cleveland Browns",
          "odds": -150
        },
        {
          "game_id": "17497",
          "sport_key": "americanfootball_nfl",
          "bet_type": "spread",
          "selection": "away",
          "team": "Kansas City Chiefs",
          "line": -3.5,
          "odds": -110
        }
      ]
    }
  Response: 201 Created
    {
      "success": true,
      "bet_id": "uuid",
      "bks_provisional": 45.2,
      "status": "PENDING",
      "placed_at": "2025-11-30T12:00:00Z"
    }
  Errors:
    400 - Validation failed
    401 - Unauthorized
    404 - Game not found
    409 - Duplicate bet within 5 minutes

GET /api/v1/bets
  Description: Get user's bets
  Auth: Required
  Query: ?status=PENDING,LIVE,SETTLED&limit=50&offset=0
  Response: 200 OK
    {
      "bets": [
        {
          "id": "uuid",
          "game_id": "17496",
          "sport_key": "americanfootball_nfl",
          "bet_type": "moneyline",
          "selection": "home",
          "team": "Cleveland Browns",
          "odds": -150,
          "stake": 100,
          "bks_provisional": 45.2,
          "bks_final": null,
          "status": "PENDING",
          "outcome": null,
          "placed_at": "2025-11-30T12:00:00Z",
          "settled_at": null
        }
      ],
      "total": 1,
      "hasMore": false
    }

GET /api/v1/bets/:betId
  Auth: Required
  Response: 200 OK
    { "bet": { ... } }
```

### 3.3.3 Odds & Games Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                      ODDS & GAMES API                            │
└─────────────────────────────────────────────────────────────────┘

GET /api/v1/odds/:sport
  Description: Get live odds for a specific sport
  Auth: Not required
  Params: sport = americanfootball_nfl | basketball_nba | icehockey_nhl | baseball_mlb
  Response: 200 OK
    {
      "sport": "americanfootball_nfl",
      "games": [
        {
          "id": "17496",
          "sport_key": "americanfootball_nfl",
          "commence_time": "2025-11-30T18:00:00Z",
          "home_team": "Cleveland Browns",
          "away_team": "San Francisco 49ers",
          "home_score": 10,
          "away_score": 8,
          "status": "live",
          "bookmakers": [
            {
              "key": "fanduel",
              "markets": [
                {
                  "key": "h2h",
                  "outcomes": [
                    { "name": "Cleveland Browns", "price": -150 },
                    { "name": "San Francisco 49ers", "price": +130 }
                  ]
                },
                {
                  "key": "spreads",
                  "outcomes": [
                    { "name": "Cleveland Browns", "price": -110, "point": -3.5 },
                    { "name": "San Francisco 49ers", "price": -110, "point": 3.5 }
                  ]
                },
                {
                  "key": "totals",
                  "outcomes": [
                    { "name": "Over", "price": -110, "point": 45.5 },
                    { "name": "Under", "price": -110, "point": 45.5 }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "updated_at": "2025-11-30T18:45:00Z"
    }

GET /api/v1/odds/upcoming/all
  Description: Get all upcoming games across sports
  Auth: Not required
  Query: ?hours=24
  Response: 200 OK
    {
      "games": [ ... ],
      "by_sport": {
        "americanfootball_nfl": 12,
        "basketball_nba": 8,
        "icehockey_nhl": 6
      }
    }
```

### 3.3.4 Leaderboard & Stats Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEADERBOARD & STATS API                       │
└─────────────────────────────────────────────────────────────────┘

GET /api/v1/leaderboard/global
  Description: Global BKS rankings
  Auth: Not required
  Query: ?limit=100&offset=0
  Response: 200 OK
    {
      "leaderboard": [
        {
          "rank": 1,
          "username": "sharpbettor",
          "overall_bks": 72.4,
          "total_bets": 156,
          "win_rate": 0.58
        },
        ...
      ],
      "updated_at": "2025-11-30T18:00:00Z"
    }

GET /api/v1/leaderboard/sport/:sportKey
  Description: Sport-specific rankings
  Auth: Not required
  Response: 200 OK
    { "leaderboard": [ ... ] }

GET /api/v1/stats/user/:username
  Description: User profile and statistics
  Auth: Not required
  Response: 200 OK
    {
      "user": {
        "username": "sportsfan123",
        "overall_bks": 54.2,
        "total_bets": 87,
        "total_won": 42,
        "total_lost": 40,
        "total_push": 5,
        "win_rate": 0.51,
        "avg_bks": 48.7,
        "created_at": "2025-10-01T00:00:00Z"
      },
      "by_sport": {
        "americanfootball_nfl": { "bets": 45, "bks": 56.1 },
        "basketball_nba": { "bets": 32, "bks": 51.3 },
        "icehockey_nhl": { "bets": 10, "bks": 52.8 }
      },
      "recent_bets": [ ... ]
    }

GET /api/v1/metrics/activity
  Description: User activity and BKS history
  Auth: Required
  Query: ?days=30
  Response: 200 OK
    {
      "history": [
        { "date": "2025-11-01", "bks": 52.1, "bets": 3 },
        { "date": "2025-11-02", "bks": 54.3, "bets": 5 },
        ...
      ],
      "summary": {
        "total_bets": 87,
        "avg_daily_bets": 2.9,
        "bks_trend": "improving"
      }
    }
```

### 3.3.5 Health & Admin Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                     HEALTH & ADMIN API                           │
└─────────────────────────────────────────────────────────────────┘

GET /health
  Description: Basic health check
  Auth: API Key required
  Response: 200 OK
    {
      "status": "healthy",
      "timestamp": "2025-11-30T18:45:00Z",
      "version": "1.0.0"
    }

GET /api/v1/health
  Description: Detailed health with API quota status
  Auth: API Key required
  Response: 200 OK
    {
      "status": "healthy",
      "services": {
        "database": "connected",
        "redis": "connected",
        "api_sports": {
          "status": "ok",
          "quota_remaining": 6800,
          "quota_daily": 7500
        },
        "odds_api": {
          "status": "ok",
          "quota_remaining": 1200,
          "quota_daily": 1613
        }
      }
    }

GET /api/v1/jobs/closing-odds/status
  Auth: API Key required
  Response: 200 OK
    {
      "running": true,
      "scheduled_captures": 15,
      "completed_today": 42
    }

POST /api/v1/jobs/closing-odds/start
POST /api/v1/jobs/closing-odds/stop
  Auth: API Key required
  Response: 200 OK
    { "success": true }
```

## 3.4 Background Jobs

```
┌─────────────────────────────────────────────────────────────────┐
│                      BACKGROUND JOBS                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ GameCreationJob                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Schedule: Daily at 2 AM + on server startup                     │
│ Source: API-Sports                                              │
│ Window: -1 day to +3 days                                       │
│                                                                 │
│ Process:                                                        │
│ 1. For each sport (NFL, NBA, NHL):                              │
│    a. Fetch games from API-Sports for date range                │
│    b. Upsert games into database (API-Sports ID as primary)     │
│    c. Update scores for completed games                         │
│ 2. Log statistics (created, updated, skipped)                   │
│                                                                 │
│ Quota Impact: ~12 requests/day                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ OddsMatchingJob                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Schedule: Every 40 seconds                                      │
│ Source: The Odds API                                            │
│                                                                 │
│ Process:                                                        │
│ 1. Check if any incomplete games in next 4 hours                │
│ 2. If none, skip API call (quota optimization)                  │
│ 3. Fetch live odds from Odds API                                │
│ 4. Match to API-Sports games using:                             │
│    - Fuzzy team name matching                                   │
│    - Commence time window (±60min upcoming, ±15min live)        │
│ 5. Store odds_api_event_id for cross-referencing                │
│ 6. Update cached_odds table                                     │
│                                                                 │
│ Quota Impact: ~400 requests/day (with optimization)             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ScoresJob                                                        │
├─────────────────────────────────────────────────────────────────┤
│ Schedule: Every 30 seconds                                      │
│ Source: API-Sports (primary), Odds API (fallback)               │
│                                                                 │
│ Process:                                                        │
│ 1. Identify games needing score updates:                        │
│    - LIVE games: update every cycle                             │
│    - IMMINENT games (<15 min): update every cycle               │
│    - FUTURE games (>15 min): update every 10th cycle            │
│ 2. Fetch scores from API-Sports                                 │
│ 3. Update game records with scores and status                   │
│ 4. On failure, fallback to Odds API                             │
│                                                                 │
│ Quota Impact: ~5,760 requests/day (with dynamic polling)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SettlementJob                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Schedule: Every 5 minutes                                       │
│ Source: Internal database                                       │
│                                                                 │
│ Process:                                                        │
│ 1. Find games that are now completed                            │
│ 2. For each completed game:                                     │
│    a. Find all PENDING/LIVE bets on this game                   │
│    b. Calculate final outcome (WIN/LOSS/PUSH)                   │
│    c. Calculate final BKS using actual scores                   │
│    d. Update bet record with bks_final, outcome, status         │
│ 3. For parlays:                                                 │
│    a. Update each leg's outcome                                 │
│    b. Determine parlay outcome (all legs must win)              │
│ 4. Update user's overall_bks                                    │
│ 5. Increment user's total_won or total_lost                     │
│                                                                 │
│ Settlement Logic:                                                │
│ - Moneyline: team with higher score wins                        │
│ - Spread: (team_score + spread) vs opponent_score               │
│ - Total: (home_score + away_score) vs total_line                │
│ - Push: exact match on spread/total                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ClosingOddsJob                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Schedule: Per-bet, 2 minutes before game commence               │
│ Source: The Odds API                                            │
│                                                                 │
│ Process:                                                        │
│ 1. When bet is placed, schedule capture for T-2 minutes         │
│ 2. At scheduled time, fetch current odds                        │
│ 3. Store in closing_odds table                                  │
│ 4. Used by BKS calculator for Accuracy (CLV) component          │
│                                                                 │
│ Quota Impact: Variable (depends on bet volume)                  │
└─────────────────────────────────────────────────────────────────┘
```

## 3.5 Middleware Stack

```typescript
// Application middleware order
app.use(helmet());                    // Security headers
app.use(cors(corsOptions));           // CORS configuration
app.use(express.json());              // JSON parsing
app.use(apiKeyAuth());                // API key validation (if enabled)
app.use(globalRateLimiter);           // 60 req/min per IP

// Route-specific middleware
router.use('/api/v1/bets', bksRateLimiter);  // 10 req/min
router.use('/api/v1/bets', authenticate);     // JWT required
router.use('/api/v1/bets/:betId', authenticate);

// Rate limiter configuration
const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,           // 1 minute
  max: 60,                       // 60 requests
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,  // Disable for ngrok compatibility
  },
});

const bksRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

## 3.6 Error Handling

```typescript
// Standard error response format
interface ErrorResponse {
  error: string;           // Error category
  message: string;         // Human-readable description
  code?: string;           // Machine-readable code
  details?: object;        // Additional context
}

// HTTP Status Code Usage
const STATUS_CODES = {
  200: 'Success',
  201: 'Created (bet placed)',
  400: 'Bad Request (validation failed)',
  401: 'Unauthorized (no/invalid token)',
  403: 'Forbidden (account suspended, not admin)',
  404: 'Not Found (game/bet doesn\'t exist)',
  409: 'Conflict (duplicate bet within 5 minutes)',
  429: 'Too Many Requests (rate limit exceeded)',
  500: 'Internal Server Error',
};

// Example error responses
{
  "error": "ValidationError",
  "message": "Invalid odds format. Must be <= -100 or >= 100.",
  "code": "INVALID_ODDS"
}

{
  "error": "Unauthorized",
  "message": "Account suspended. Please verify your email.",
  "code": "ACCOUNT_SUSPENDED"
}

{
  "error": "Conflict",
  "message": "Duplicate bet detected. Please wait 5 minutes.",
  "code": "DUPLICATE_BET"
}
```

---

# 4. BKS Algorithm Specification

## 4.1 Overview

The **Ball Knowing Score (BKS)** is a deterministic algorithm that evaluates betting skill on a 0-100 scale. Unlike simple win/loss tracking, BKS accounts for bet difficulty, market timing, complexity, and outcome margin.

## 4.2 Formula

```
┌─────────────────────────────────────────────────────────────────┐
│                     BKS MASTER FORMULA                           │
└─────────────────────────────────────────────────────────────────┘

BKS = Base × M

Where:
  Base = 100 × Σ(wᵢ × Cᵢ)
  M = Outcome Multiplier

┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT WEIGHTS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Base = 100 × (0.45×D + 0.18×C + 0.13×P + 0.10×A + 0.10×S + 0.04×K)
│                                                                 │
│  Component    Weight   Description                              │
│  ─────────────────────────────────────────────────────────────  │
│  D (Difficulty)  45%   Fair win probability (harder = higher)   │
│  C (Complexity)  18%   Parlay legs + correlation adjustment     │
│  P (Payout)      13%   Return multiple (capped at 10x)          │
│  A (Accuracy)    10%   Closing Line Value (market timing)       │
│  S (Stake)       10%   Stake significance (user percentile)     │
│  K (Context)      4%   Game importance (regular → finals)       │
│                                                                 │
│  Total:         100%                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.3 Component Specifications

### 4.3.1 Difficulty (D) - 45%

```
┌─────────────────────────────────────────────────────────────────┐
│                    DIFFICULTY COMPONENT                          │
└─────────────────────────────────────────────────────────────────┘

Purpose: Reward betting on underdogs and avoid inflating scores
         for heavy favorites. HARDER bets get HIGHER D scores.

Formula:
  D = 1 - fair_probability(selection)

  Where fair_probability is the de-vigged probability of winning.
  Inverting ensures harder bets (lower win probability) score higher.

De-vigging Process (2-way market):
  1. Convert American odds to decimal:
     if (odds > 0): decimal = 1 + (odds / 100)
     else: decimal = 1 + (100 / |odds|)

  2. Calculate raw implied probabilities:
     rawA = 1 / decimal_A
     rawB = 1 / decimal_B

  3. Remove vig proportionally:
     total = rawA + rawB  // Typically 1.03-1.10
     fair_p_A = rawA / total
     fair_p_B = rawB / total

  4. D = 1 - fair_probability of selected outcome

De-vigging Process (3-way market):
  Same as above but with three outcomes (home, away, draw)

Example:
  Home: -150 → decimal = 1.667 → raw = 0.60
  Away: +130 → decimal = 2.30 → raw = 0.435
  Total = 1.035
  Fair home = 0.60 / 1.035 = 0.58
  Fair away = 0.435 / 1.035 = 0.42

  If betting home (favorite): D = 1 - 0.58 = 0.42 (easier = lower D)
  If betting away (underdog): D = 1 - 0.42 = 0.58 (harder = higher D)

Parlays:
  p_parlay = p_leg1 × p_leg2 × ... × p_legN (capped at 12 legs)
  D_parlay = 1 - p_parlay

Range: [0, 1]
```

### 4.3.2 Complexity (C) - 18%

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLEXITY COMPONENT                          │
└─────────────────────────────────────────────────────────────────┘

Purpose: Reward multi-leg parlays while penalizing highly correlated
         same-game parlays (SGP).

Formula:
  C = min((L - 1) × 0.3, 0.9) × (1 - 0.5 × ρ)

  Where:
  - L = number of legs (capped at 12)
  - ρ = correlation factor [0, 1]

Base Complexity (before correlation):
  baseComplexity = min((L - 1) × 0.3, 0.9)

  legs    baseComplexity
  ───────────────────────
  1       0.00  (single bet)
  2       0.30
  3       0.60
  4       0.90  (capped)
  5+      0.90  (capped)

Correlation Adjustment:
  Higher correlation REDUCES complexity score (penalizes correlated bets)
  C = baseComplexity × (1 - 0.5 × correlation)

  Where correlation ∈ [0, 1]:
  - 0.0: Independent legs (different games) - full complexity credit
  - 0.5: Moderate correlation - 75% complexity credit
  - 1.0: Perfect correlation - 50% complexity credit

Clamping:
  C = clamp(C, 0, 1)

Example:
  3-leg parlay, same game, correlation = 0.6
  baseComplexity = min((3-1) × 0.3, 0.9) = 0.60
  C = 0.60 × (1 - 0.5 × 0.6) = 0.60 × 0.70 = 0.42

Range: [0, 1] (single bets always C = 0)
```

### 4.3.3 Payout (P) - 13%

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYOUT COMPONENT                            │
└─────────────────────────────────────────────────────────────────┘

Purpose: Reward higher-risk bets with conviction bonus based on stake.
         Includes difficulty-scaled ceiling to prevent gaming.

Master Formula:
  P = clamp((PM / 10) × CM, 0, P_max)

  Where:
  - PM = payout multiple (decimal_odds - 1)
  - CM = conviction multiplier = 1.0 + (10.0 × SF)
  - SF = stake factor = log₁₀(stake + 9) / log₁₀(10009)
  - P_max = 1.0 + (D × 2.0) = difficulty-scaled ceiling

Step 1: Calculate Payout Multiple (PM)
  Single bet: PM = decimal_odds - 1
  Parlay: PM = (product of leg decimals) - 1

Step 2: Calculate Stake Factor (SF)
  SF = log₁₀(stake + 9) / log₁₀(10009)

  stake    SF      CM (conviction)
  ───────────────────────────────────
  $10      0.32    4.2×
  $50      0.45    5.5×
  $100     0.51    6.1×
  $500     0.68    7.8×
  $1000    0.75    8.5×
  $5000    0.93    10.3×
  $10000   1.00    11.0×

Step 3: Calculate Difficulty-Scaled Ceiling
  P_max = 1.0 + (D × 2.0)

  - Low difficulty (D=0.3): P_max = 1.6
  - Medium difficulty (D=0.5): P_max = 2.0
  - High difficulty (D=0.7): P_max = 2.4
  - Max difficulty (D=1.0): P_max = 3.0

  This prevents easy bets with low conviction from gaming the system.

Step 4: Calculate Final P
  P_unclamped = (PM / 10) × CM
  P = clamp(P_unclamped, 0, P_max)

American to Decimal Conversion:
  if (odds > 0): decimal = 1 + (odds / 100)
  else: decimal = 1 + (100 / |odds|)

Example:
  Bet: +200 odds, $100 stake, D = 0.4
  PM = 3.0 - 1 = 2.0
  SF = log₁₀(109) / log₁₀(10009) = 0.51
  CM = 1.0 + (10.0 × 0.51) = 6.1
  P_unclamped = (2.0 / 10) × 6.1 = 1.22
  P_max = 1.0 + (0.4 × 2.0) = 1.8
  P = clamp(1.22, 0, 1.8) = 1.22

Range: [0, P_max] where P_max ∈ [1.0, 3.0]
```

### 4.3.4 Accuracy (A) - 10%

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACCURACY COMPONENT                           │
│                  (Closing Line Value - CLV)                      │
└─────────────────────────────────────────────────────────────────┘

Purpose: Reward bets placed at better odds than the closing line.
         This is the gold standard for evaluating betting skill.

Calculation (using fair probability difference):
  Δp = p_open - p_close

  Where:
  - p_open = de-vigged fair probability at bet placement
  - p_close = de-vigged fair probability at game start

  Δp is clamped to [-0.15, +0.15]

Mapping to A:
  if Δp >= 0:
    A = 0.5 + 0.5 × (Δp / 0.15)
  else:
    A = 0.5 - 0.5 × (|Δp| / 0.15)

  A = clamp(A, 0, 1)

Interpretation:
  - Δp > 0: Line moved AGAINST you (you got +EV)
  - Δp = 0: Line unchanged (neutral)
  - Δp < 0: Line moved WITH you (you got -EV)

Δp to A Mapping:
  Δp       A        Interpretation
  ─────────────────────────────────
  +0.15    1.0      Exceptional timing (max +EV)
  +0.10    0.83     Excellent timing
  +0.05    0.67     Good timing
   0.00    0.50     Market average
  -0.05    0.33     Below average
  -0.10    0.17     Poor timing
  -0.15    0.0      Very poor timing (max -EV)

De-vigging Process (2-way market):
  rawA = 1 / decimal_A
  rawB = 1 / decimal_B
  total = rawA + rawB
  fair_prob_A = rawA / total
  fair_prob_B = rawB / total

Edge Cases:
  - No closing snapshot available: A = 0.5 (neutral default)
  - Missing opposing odds for de-vig: A = 0.5 (neutral)
  - Parlay: multiply per-leg fair probabilities

Range: [0, 1]
```

### 4.3.5 Stake Significance (S) - 10%

```
┌─────────────────────────────────────────────────────────────────┐
│                  STAKE SIGNIFICANCE COMPONENT                    │
└─────────────────────────────────────────────────────────────────┘

Purpose: Reward conviction using a fixed logarithmic scale.
         Higher stakes indicate higher confidence in the bet.

Formula:
  S = log₁₀(stake + 9) / log₁₀(10009)

  Where stake is the dollar amount wagered.

Stake to S Mapping:
  stake       S
  ─────────────────
  $1          0.25
  $10         0.32
  $25         0.38
  $50         0.45
  $100        0.51
  $250        0.61
  $500        0.68
  $1000       0.75
  $2500       0.85
  $5000       0.93
  $10000      1.00

Properties:
  - Logarithmic scale prevents linear stake gaming
  - Same formula used in Payout's conviction multiplier (CM)
  - Works for all users without requiring history
  - $50 default assumed if stake is missing

Clamping:
  S = clamp(S, 0, 1)

Example:
  $150 stake
  S = log₁₀(150 + 9) / log₁₀(10009)
  S = log₁₀(159) / log₁₀(10009)
  S = 2.201 / 4.000
  S = 0.55

Range: [0, 1]
```

### 4.3.6 Context (K) - 4%

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTEXT COMPONENT                            │
└─────────────────────────────────────────────────────────────────┘

Purpose: Slightly boost bets on high-stakes games where
         outcomes are harder to predict.

Default Context Mapping (from K_MAP_DEFAULT):
  context         K       Description
  ──────────────────────────────────────────────
  preseason       0.2     Exhibition games
  regular         0.4     Regular season
  playoffs        0.7     Playoff games
  finals          1.0     Championship series/games

Extensibility:
  Additional context values can be configured via K_MAP_JSON
  environment variable to add custom mappings.

Default: K = 0.4 (regular season) if context not specified

Clamping:
  K = clamp(K, 0, 1)

Range: [0.2, 1.0] (based on default mappings)
```

## 4.4 Outcome Multiplier (M)

```
┌─────────────────────────────────────────────────────────────────┐
│                   OUTCOME MULTIPLIER                             │
└─────────────────────────────────────────────────────────────────┘

The multiplier adjusts Base score based on bet outcome.

┌─────────────────────────────────────────────────────────────────┐
│                    SETTLED BETS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WIN:                                                           │
│    M = 0.60 + 0.40 × clamp(z/3, 0, 1)                           │
│                                                                 │
│    Where z = cover_margin / σ (z-score of cover)                │
│    cover_margin = (actual_margin - spread)                      │
│    σ = sport variance (see below)                               │
│                                                                 │
│    Interpretation:                                              │
│    - Close win (z ≈ 0): M ≈ 0.60                                │
│    - Solid win (z ≈ 1.5): M ≈ 0.80                              │
│    - Blowout win (z ≥ 3): M = 1.00                              │
│                                                                 │
│  LOSS:                                                          │
│    M = 0.10 + 0.40 × (1 - clamp(|z|/3, 0, 1))                   │
│                                                                 │
│    Interpretation:                                              │
│    - Close loss (z ≈ 0): M ≈ 0.50                               │
│    - Moderate loss (z ≈ -1.5): M ≈ 0.30                         │
│    - Blowout loss (z ≤ -3): M = 0.10                            │
│                                                                 │
│  PUSH:                                                          │
│    M = 0.55                                                     │
│                                                                 │
│  VOID:                                                          │
│    M = 0.50 (bet not counted in overall BKS)                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   PROVISIONAL BETS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PENDING (game not started, no score data):                     │
│    M = 0.50 + (D × 0.45)                                        │
│                                                                 │
│    Where D = difficulty component [0, 1]                        │
│    Range: [0.50, 0.95]                                          │
│                                                                 │
│    Interpretation:                                              │
│    - Easy bet (D=0.3): M ≈ 0.64                                 │
│    - Medium bet (D=0.5): M ≈ 0.73                               │
│    - Hard bet (D=0.8): M ≈ 0.86                                 │
│                                                                 │
│  LIVE (game in progress, with score data):                      │
│    M = clamp(0.25 + 0.30×τ + 0.25×tanh(z/2), 0.10, 0.95)        │
│                                                                 │
│    Where:                                                       │
│    - τ = time_elapsed / game_duration ∈ [0, 1]                  │
│    - z = current_cover_margin / σ                               │
│                                                                 │
│    Interpretation:                                              │
│    - Early game, close: M ≈ 0.40                                │
│    - Mid game, winning: M ≈ 0.60                                │
│    - Late game, winning big: M ≈ 0.85                           │
│                                                                 │
│    Updates in real-time as game progresses.                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   SPORT VARIANCE (σ)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Sport                σ      Rationale                          │
│  ────────────────────────────────────────────────────────────   │
│  NFL                  1.5    High variance, any given Sunday    │
│  NCAAF                1.6    Even more unpredictable            │
│  NBA                  1.0    Moderate variance                  │
│  NHL                  0.6    Lower scoring, more predictable    │
│  MLB                  0.7    High variance but large sample     │
│  Soccer (EPL)         0.5    Low scoring, predictable           │
│                                                                 │
│  Higher σ = more forgiving multiplier for close outcomes        │
│  Lower σ = requires larger margins for same multiplier boost    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.5 Complete Calculation Example

```
┌─────────────────────────────────────────────────────────────────┐
│               EXAMPLE: NFL MONEYLINE BET                         │
└─────────────────────────────────────────────────────────────────┘

Bet Details:
  - Game: Chiefs (-180) vs Raiders (+155)
  - Selection: Raiders (underdog)
  - Entry odds: +155 (Raiders), -180 (Chiefs)
  - Closing odds: +145 (Raiders), -165 (Chiefs)
  - Stake: $150
  - Context: Regular season
  - Outcome: Raiders WIN by 7 points

Step 1: Calculate Difficulty (D)
  Entry decimals:
    Chiefs: 1 + 100/180 = 1.556 → raw = 0.643
    Raiders: 1 + 155/100 = 2.55 → raw = 0.392
  Total = 1.035
  fair_raiders = 0.392 / 1.035 = 0.379
  D = 1 - 0.379 = 0.621 (harder bet = higher D)

Step 2: Calculate Complexity (C)
  Single bet: legs = 1
  C = min((1-1) × 0.3, 0.9) × (1 - 0.5 × 0)
  C = 0 (single bets always have C = 0)

Step 3: Calculate Payout (P)
  PM = decimal - 1 = 2.55 - 1 = 1.55
  SF = log₁₀(150 + 9) / log₁₀(10009) = 2.201 / 4.000 = 0.55
  CM = 1.0 + (10.0 × 0.55) = 6.5
  P_unclamped = (1.55 / 10) × 6.5 = 1.01
  P_max = 1.0 + (0.621 × 2.0) = 2.24
  P = clamp(1.01, 0, 2.24) = 1.01

Step 4: Calculate Accuracy (A)
  Entry: fair_raiders = 0.379
  Closing decimals:
    Chiefs: 1 + 100/165 = 1.606 → raw = 0.623
    Raiders: 1 + 145/100 = 2.45 → raw = 0.408
  Total_close = 1.031
  fair_raiders_close = 0.408 / 1.031 = 0.396

  Δp = 0.379 - 0.396 = -0.017
  A = 0.5 - 0.5 × (0.017 / 0.15) = 0.5 - 0.057 = 0.44
  (Negative CLV: line moved against us slightly)

Step 5: Calculate Stake Significance (S)
  S = log₁₀(150 + 9) / log₁₀(10009) = 0.55

Step 6: Calculate Context (K)
  K = 0.4 (regular season)

Step 7: Calculate Base
  Base = 100 × (0.45×0.621 + 0.18×0 + 0.13×1.01 +
                0.10×0.44 + 0.10×0.55 + 0.04×0.4)
  Base = 100 × (0.279 + 0 + 0.131 + 0.044 + 0.055 + 0.016)
  Base = 100 × 0.525
  Base = 52.5

Step 8: Calculate Outcome Multiplier (M)
  Outcome: WIN
  cover_margin = 7 points (won by 7)
  z = 7 / 1.5 = 4.67 (NFL σ = 1.5)
  M = 0.60 + 0.40 × clamp(4.67/3, 0, 1)
  M = 0.60 + 0.40 × 1.0 = 1.00

Step 9: Final BKS
  BKS = min(100, Base × M) = min(100, 52.5 × 1.00) = 52.5

Result: BKS = 52.5 (rounded to 1 decimal)

Interpretation:
  - Above average score for betting the underdog
  - High D (0.621) from difficult selection boosted base
  - P component (1.01) rewarded conviction with $150 stake
  - Full multiplier from blowout 7-point win
```

## 4.6 Algorithm Properties

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALGORITHM PROPERTIES                          │
└─────────────────────────────────────────────────────────────────┘

1. DETERMINISM
   - Same inputs always produce same BKS
   - No randomness or external factors
   - Reproducible and auditable

2. RANGE
   - Theoretical: [0, 100]
   - Practical: [5, 95]
   - No soft floors or ceilings

3. DISTRIBUTION (Expected)
   - Mean: ~45-50
   - Std Dev: ~15-20
   - Skilled bettors: 55-70
   - Elite bettors: 70+

4. MONOTONICITY
   - Better bets → Higher BKS
   - Winning > Losing (with margin consideration)
   - Harder bets > Easier bets

5. FAIRNESS
   - Normalized across sports (via σ)
   - Accounts for market efficiency (CLV)
   - No advantage to bet volume alone

6. STABILITY
   - Overall BKS = mean of settled bets
   - Requires ~20+ bets for statistical significance
   - Rolling windows available (30-day, 90-day)
```

---

# 5. Database Schema

## 5.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTITY RELATIONSHIPS                          │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   auth.users     │
                    │   (Supabase)     │
                    └────────┬─────────┘
                             │ 1:1
                             ▼
┌──────────────────┐  1:N  ┌──────────────────┐
│  sport_configs   │◀─────│      users       │
└──────────────────┘       └────────┬─────────┘
        │                           │
        │ 1:N                       │ 1:N
        ▼                           ▼
┌──────────────────┐        ┌──────────────────┐
│      games       │◀──────│       bets       │
└────────┬─────────┘  N:1  └────────┬─────────┘
         │                          │
         │ 1:N                      │ 1:N
         ▼                          ▼
┌──────────────────┐        ┌──────────────────┐
│   cached_odds    │        │   parlay_legs    │
└──────────────────┘        └──────────────────┘
         │
         │ 1:1
         ▼
┌──────────────────┐
│  closing_odds    │
└──────────────────┘
```

## 5.2 Table Definitions

### 5.2.1 users

```sql
┌─────────────────────────────────────────────────────────────────┐
│                         users                                    │
├─────────────────────────────────────────────────────────────────┤
│ Primary user profile table extending Supabase auth              │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE users (
    -- Primary Key (references auth.users)
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Profile
    username        VARCHAR(50) UNIQUE NOT NULL,
    display_name    VARCHAR(100),
    avatar_url      TEXT,

    -- BKS Statistics
    overall_bks     DECIMAL(5,1) DEFAULT 50.0,  -- 0.0 to 100.0
    total_bets      INTEGER DEFAULT 0,
    total_won       INTEGER DEFAULT 0,
    total_lost      INTEGER DEFAULT 0,
    total_push      INTEGER DEFAULT 0,
    total_parlays   INTEGER DEFAULT 0,

    -- Streaks
    current_streak  INTEGER DEFAULT 0,         -- Positive = wins, negative = losses
    best_streak     INTEGER DEFAULT 0,

    -- Metadata
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    last_bet_at     TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_username CHECK (username ~ '^[a-zA-Z0-9_]{3,50}$'),
    CONSTRAINT valid_overall_bks CHECK (overall_bks >= 0 AND overall_bks <= 100),
    CONSTRAINT non_negative_counts CHECK (
        total_bets >= 0 AND
        total_won >= 0 AND
        total_lost >= 0 AND
        total_push >= 0
    )
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_overall_bks ON users(overall_bks DESC);
CREATE INDEX idx_users_total_bets ON users(total_bets DESC);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);
```

### 5.2.2 games

```sql
┌─────────────────────────────────────────────────────────────────┐
│                          games                                   │
├─────────────────────────────────────────────────────────────────┤
│ Sports games from API-Sports with cross-referenced Odds API ID  │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE games (
    -- Primary Key (API-Sports integer ID as string)
    id                  VARCHAR(255) PRIMARY KEY,

    -- Sport & League
    sport_key           VARCHAR(50) NOT NULL,
    league_id           INTEGER,
    season              INTEGER,
    week                VARCHAR(20),

    -- Teams
    home_team           VARCHAR(255) NOT NULL,
    away_team           VARCHAR(255) NOT NULL,
    home_team_id        INTEGER,
    away_team_id        INTEGER,
    home_logo           TEXT,
    away_logo           TEXT,

    -- Scheduling
    commence_time       TIMESTAMPTZ NOT NULL,
    venue_name          VARCHAR(255),
    venue_city          VARCHAR(100),

    -- Scores (NULL until game starts)
    home_score          INTEGER,
    away_score          INTEGER,

    -- Status
    status              VARCHAR(20) DEFAULT 'upcoming',  -- upcoming, live, completed
    status_detail       VARCHAR(50),                     -- Q1, Q2, HT, Q3, Q4, OT, FT
    completed           BOOLEAN DEFAULT FALSE,

    -- Cross-reference
    odds_api_event_id   VARCHAR(255),  -- The Odds API event ID

    -- Metadata
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    last_odds_update    TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('upcoming', 'live', 'completed')),
    CONSTRAINT valid_scores CHECK (
        (home_score IS NULL AND away_score IS NULL) OR
        (home_score >= 0 AND away_score >= 0)
    )
);

-- Indexes
CREATE INDEX idx_games_sport_key ON games(sport_key);
CREATE INDEX idx_games_commence_time ON games(commence_time);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_completed ON games(completed);
CREATE INDEX idx_games_sport_commence ON games(sport_key, commence_time);
CREATE INDEX idx_games_odds_api_event_id ON games(odds_api_event_id);

-- No RLS - games are public
```

### 5.2.3 bets

```sql
┌─────────────────────────────────────────────────────────────────┐
│                           bets                                   │
├─────────────────────────────────────────────────────────────────┤
│ User bets with full BKS component breakdown                     │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE bets (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign Keys
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id             VARCHAR(255) REFERENCES games(id),  -- NULL for multi-game parlays

    -- Bet Classification
    sport_key           VARCHAR(50) NOT NULL,
    bet_type            VARCHAR(20) NOT NULL,  -- moneyline, spread, total, parlay
    market_type         VARCHAR(10) NOT NULL,  -- 2way, 3way

    -- Selection Details
    selection           VARCHAR(20) NOT NULL,  -- home, away, draw, over, under
    team                VARCHAR(255),
    line                DECIMAL(5,1),          -- Spread or total line
    odds                INTEGER NOT NULL,       -- American odds
    stake               DECIMAL(10,2) NOT NULL,

    -- Parlay Info
    legs                INTEGER DEFAULT 1 CHECK (legs >= 1 AND legs <= 12),
    correlation         DECIMAL(4,3) DEFAULT 0,
    combined_odds       INTEGER,               -- Combined parlay odds

    -- BKS Components (stored for auditability)
    base_score          DECIMAL(5,2),
    difficulty          DECIMAL(4,3),
    complexity          DECIMAL(4,3),
    payout              DECIMAL(4,3),
    accuracy_clv        DECIMAL(4,3),
    stake_significance  DECIMAL(4,3),
    context_novelty     DECIMAL(4,3),

    -- BKS Scores
    bks_provisional     DECIMAL(5,1),          -- Calculated at placement
    bks_final           DECIMAL(5,1),          -- Calculated at settlement
    m_provisional       DECIMAL(4,3),          -- Multiplier at placement
    m_final             DECIMAL(4,3),          -- Multiplier at settlement

    -- Outcome
    status              VARCHAR(20) DEFAULT 'PENDING',
    outcome             VARCHAR(10),           -- WIN, LOSS, PUSH, VOID
    cover_margin        DECIMAL(5,2),          -- Actual margin of victory/defeat

    -- Security
    placement_signature  VARCHAR(64),          -- HMAC-SHA256
    settlement_signature VARCHAR(64),

    -- Timestamps
    placed_at           TIMESTAMPTZ DEFAULT NOW(),
    settled_at          TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_bet_type CHECK (bet_type IN ('moneyline', 'spread', 'total', 'parlay')),
    CONSTRAINT valid_market_type CHECK (market_type IN ('2way', '3way')),
    CONSTRAINT valid_selection CHECK (selection IN ('home', 'away', 'draw', 'over', 'under')),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'LIVE', 'SETTLING', 'SETTLED', 'VOID')),
    CONSTRAINT valid_outcome CHECK (outcome IS NULL OR outcome IN ('WIN', 'LOSS', 'PUSH', 'VOID')),
    CONSTRAINT valid_odds CHECK (odds <= -100 OR odds >= 100),
    CONSTRAINT valid_stake CHECK (stake > 0),
    CONSTRAINT valid_bks CHECK (
        (bks_provisional IS NULL OR (bks_provisional >= 0 AND bks_provisional <= 100)) AND
        (bks_final IS NULL OR (bks_final >= 0 AND bks_final <= 100))
    )
);

-- Indexes
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_game_id ON bets(game_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_placed_at ON bets(placed_at DESC);
CREATE INDEX idx_bets_user_status ON bets(user_id, status);
CREATE INDEX idx_bets_sport_key ON bets(sport_key);

-- Row Level Security
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bets"
    ON bets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bets"
    ON bets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all bets"
    ON bets FOR ALL
    USING (auth.role() = 'service_role');
```

### 5.2.4 parlay_legs

```sql
┌─────────────────────────────────────────────────────────────────┐
│                       parlay_legs                                │
├─────────────────────────────────────────────────────────────────┤
│ Individual legs for multi-leg parlay bets                       │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE parlay_legs (
    -- Primary Key
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign Keys
    bet_id          UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
    game_id         VARCHAR(255) NOT NULL REFERENCES games(id),

    -- Leg Details
    leg_number      INTEGER NOT NULL CHECK (leg_number >= 1 AND leg_number <= 12),
    sport_key       VARCHAR(50) NOT NULL,
    bet_type        VARCHAR(20) NOT NULL,
    selection       VARCHAR(20) NOT NULL,
    team            VARCHAR(255),
    line            DECIMAL(5,1),
    odds            INTEGER NOT NULL,

    -- Outcome
    status          VARCHAR(20) DEFAULT 'PENDING',
    outcome         VARCHAR(10),
    cover_margin    DECIMAL(5,2),

    -- Timestamps
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    settled_at      TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_leg UNIQUE (bet_id, leg_number),
    CONSTRAINT valid_leg_status CHECK (status IN ('PENDING', 'LIVE', 'SETTLED', 'VOID')),
    CONSTRAINT valid_leg_outcome CHECK (outcome IS NULL OR outcome IN ('WIN', 'LOSS', 'PUSH', 'VOID'))
);

-- Indexes
CREATE INDEX idx_parlay_legs_bet_id ON parlay_legs(bet_id);
CREATE INDEX idx_parlay_legs_game_id ON parlay_legs(game_id);
CREATE INDEX idx_parlay_legs_status ON parlay_legs(status);

-- RLS inherited from bets table through join
```

### 5.2.5 sport_configs

```sql
┌─────────────────────────────────────────────────────────────────┐
│                      sport_configs                               │
├─────────────────────────────────────────────────────────────────┤
│ Sport-specific configuration for BKS calculations               │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE sport_configs (
    -- Primary Key
    sport_key               VARCHAR(50) PRIMARY KEY,

    -- Display
    sport_title             VARCHAR(100) NOT NULL,
    sport_group             VARCHAR(50),          -- NFL, NBA, NHL, MLB, Soccer
    active                  BOOLEAN DEFAULT TRUE,

    -- BKS Configuration
    variance                DECIMAL(3,1) NOT NULL,  -- σ for multiplier calculations
    typical_margin          DECIMAL(4,2),           -- Typical winning margin

    -- API Configuration
    api_sports_league_id    INTEGER,
    api_sports_endpoint     VARCHAR(100),
    odds_api_key            VARCHAR(100),

    -- Settlement
    settlement_delay_hours  INTEGER DEFAULT 2,

    -- Timestamps
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO sport_configs (sport_key, sport_title, variance, api_sports_league_id, odds_api_key) VALUES
('americanfootball_nfl', 'NFL', 1.5, 1, 'americanfootball_nfl'),
('americanfootball_ncaaf', 'NCAAF', 1.6, 2, 'americanfootball_ncaaf'),
('basketball_nba', 'NBA', 1.0, 12, 'basketball_nba'),
('icehockey_nhl', 'NHL', 0.6, 57, 'icehockey_nhl'),
('baseball_mlb', 'MLB', 0.7, 1, 'baseball_mlb');
```

### 5.2.6 cached_odds

```sql
┌─────────────────────────────────────────────────────────────────┐
│                       cached_odds                                │
├─────────────────────────────────────────────────────────────────┤
│ Cached odds data from The Odds API                              │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE cached_odds (
    -- Primary Key
    cache_key       VARCHAR(255) PRIMARY KEY,

    -- Reference
    sport_key       VARCHAR(50) NOT NULL,
    event_id        VARCHAR(255),

    -- Data
    odds_data       JSONB NOT NULL,

    -- Cache Control
    cached_at       TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    hit_count       INTEGER DEFAULT 0,

    -- Indexes included in primary key
    CONSTRAINT valid_expiry CHECK (expires_at > cached_at)
);

-- Indexes
CREATE INDEX idx_cached_odds_sport_key ON cached_odds(sport_key);
CREATE INDEX idx_cached_odds_event_id ON cached_odds(event_id);
CREATE INDEX idx_cached_odds_expires_at ON cached_odds(expires_at);

-- Auto-cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_odds()
RETURNS void AS $$
BEGIN
    DELETE FROM cached_odds WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

### 5.2.7 closing_odds

```sql
┌─────────────────────────────────────────────────────────────────┐
│                      closing_odds                                │
├─────────────────────────────────────────────────────────────────┤
│ Pre-commence odds snapshots for CLV calculation                 │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE closing_odds (
    -- Primary Key
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Reference
    game_id         VARCHAR(255) NOT NULL REFERENCES games(id),

    -- Odds Snapshot
    market_key      VARCHAR(20) NOT NULL,  -- h2h, spreads, totals
    bookmaker       VARCHAR(50) NOT NULL,

    home_odds       INTEGER,
    away_odds       INTEGER,
    draw_odds       INTEGER,
    home_spread     DECIMAL(4,1),
    away_spread     DECIMAL(4,1),
    total_line      DECIMAL(4,1),
    over_odds       INTEGER,
    under_odds      INTEGER,

    -- Metadata
    captured_at     TIMESTAMPTZ DEFAULT NOW(),
    minutes_before_start INTEGER,

    -- Constraints
    CONSTRAINT unique_closing_snapshot UNIQUE (game_id, market_key, bookmaker)
);

-- Indexes
CREATE INDEX idx_closing_odds_game_id ON closing_odds(game_id);
CREATE INDEX idx_closing_odds_captured_at ON closing_odds(captured_at);
```

### 5.2.8 daily_quota_tracking

```sql
┌─────────────────────────────────────────────────────────────────┐
│                   daily_quota_tracking                           │
├─────────────────────────────────────────────────────────────────┤
│ API quota tracking for rate limiting                            │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE daily_quota_tracking (
    -- Primary Key
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tracking
    api_name        VARCHAR(50) NOT NULL,  -- api_sports, odds_api
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    requests_made   INTEGER DEFAULT 0,
    quota_limit     INTEGER NOT NULL,

    -- Status
    quota_exceeded  BOOLEAN DEFAULT FALSE,
    last_request_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_daily_quota UNIQUE (api_name, date)
);

-- Indexes
CREATE INDEX idx_daily_quota_api_date ON daily_quota_tracking(api_name, date);
```

### 5.2.9 bks_daily_snapshots

```sql
┌─────────────────────────────────────────────────────────────────┐
│                   bks_daily_snapshots                            │
├─────────────────────────────────────────────────────────────────┤
│ Daily BKS snapshots for historical tracking                     │
└─────────────────────────────────────────────────────────────────┘

CREATE TABLE bks_daily_snapshots (
    -- Primary Key
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Reference
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Snapshot
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    overall_bks     DECIMAL(5,1) NOT NULL,
    bets_today      INTEGER DEFAULT 0,
    wins_today      INTEGER DEFAULT 0,
    losses_today    INTEGER DEFAULT 0,

    -- Constraints
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- Indexes
CREATE INDEX idx_bks_snapshots_user_id ON bks_daily_snapshots(user_id);
CREATE INDEX idx_bks_snapshots_date ON bks_daily_snapshots(date DESC);
CREATE INDEX idx_bks_snapshots_user_date ON bks_daily_snapshots(user_id, date DESC);

-- RLS
ALTER TABLE bks_daily_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots"
    ON bks_daily_snapshots FOR SELECT
    USING (auth.uid() = user_id);
```

## 5.3 Database Functions & Triggers

```sql
┌─────────────────────────────────────────────────────────────────┐
│                   FUNCTIONS & TRIGGERS                           │
└─────────────────────────────────────────────────────────────────┘

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update user stats on bet settlement
CREATE OR REPLACE FUNCTION update_user_stats_on_settlement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'SETTLED' AND OLD.status != 'SETTLED' THEN
        UPDATE users SET
            total_bets = total_bets + 1,
            total_won = total_won + CASE WHEN NEW.outcome = 'WIN' THEN 1 ELSE 0 END,
            total_lost = total_lost + CASE WHEN NEW.outcome = 'LOSS' THEN 1 ELSE 0 END,
            total_push = total_push + CASE WHEN NEW.outcome = 'PUSH' THEN 1 ELSE 0 END,
            last_bet_at = NEW.settled_at
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_bet_settled
    AFTER UPDATE ON bets
    FOR EACH ROW
    WHEN (NEW.status = 'SETTLED' AND OLD.status != 'SETTLED')
    EXECUTE FUNCTION update_user_stats_on_settlement();
```

---

# 6. Appendices

## 6.1 Glossary

| Term | Definition |
|------|------------|
| **BKS** | Ball Knowing Score - proprietary 0-100 skill metric |
| **CLV** | Closing Line Value - difference between entry and closing odds |
| **Parlay** | Multi-leg bet where all selections must win |
| **SGP** | Same-Game Parlay - parlay with legs from single game |
| **Moneyline** | Bet on outright winner (no spread) |
| **Spread** | Point handicap applied to underdog |
| **Total** | Over/under bet on combined score |
| **Vig/Juice** | Bookmaker's margin built into odds |
| **De-vig** | Removing bookmaker margin to get fair probability |
| **Sharp** | Professional/skilled bettor |
| **Square** | Recreational/casual bettor |

## 6.2 API Rate Limits

| API | Daily Limit | Requests/Min | Current Usage |
|-----|-------------|--------------|---------------|
| API-Sports (NFL) | 7,500 | 10 | ~500/day |
| API-Sports (NBA) | 7,500 | 10 | ~500/day |
| API-Sports (NHL) | 7,500 | 10 | ~500/day |
| The Odds API | 1,613 | N/A | ~400/day |

## 6.3 Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development|production

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# External APIs
API_SPORTS_KEY=xxx
ODDS_API_KEY=xxx

# Redis
REDIS_URL=redis://localhost:6379

# Security
BKS_SECRET=xxx                    # HMAC signing
API_KEY_ENABLED=true|false
API_KEY=xxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

# BKS Algorithm
BKS_VERSION=3.4.0
SIGMA_DEFAULTS_JSON={}
K_MAP_JSON={}
```

## 6.4 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-01 | Initial release |
| 2.0.0 | 2025-11-30 | BKS v3.4.0, dual-source architecture |

---

**Document Classification:** Internal
**Owner:** Engineering Team
**Review Cycle:** Quarterly
