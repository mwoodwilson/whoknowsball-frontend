<div align="center">

# 🏀 WhoKnowsBall

**The metric that settles every sports group chat argument.**

[![React Native](https://img.shields.io/badge/React_Native-0.82-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

[The Problem](#the-problem) • [The Solution](#the-solution) • [The App](#-the-app) • [Architecture](#-technical-architecture) • [How I Built This](#-how-this-got-built) • [Contact](#-about-me)

</div>

---

## The Problem

Every sports fan thinks they know ball. In every group chat, in every sports bar, there exists the same argument- who knows ball?  When your buddy claims he "called" the Chiefs winning in OT and points to this as proof of ball knowledge superiority, how can you effectively argue with him? How can you prove him wrong, and do the impossible- get a chiefs fan to stop talking?

Betting apps track money. But **money doesn't measure skill.** A lucky $10 parlay doesn't mean you understand sports better than someone who consistently identifies value in underdogs.

There's no standardized way to measure sports betting intelligence. Until now.

---

## The Solution

WhoKnowsBall introduces the **Ball Knowing Score (BKS)**—a 0-100 rating that quantifies betting skill, not just bankroll size or frequency.

The BKS algorithm evaluates picks across multiple dimensions:

| Dimension | What It Measures |
|-----------|------------------|
| **Difficulty** | Were you betting heavy favorites or finding value in underdogs? |
| **Complexity** | Simple moneyline or sophisticated multi-leg parlay? |
| **Accuracy** | Did you beat the closing line (CLV)? |
| **Stake Significance** | Are you putting conviction behind your picks? |
| **Context** | Game importance, market efficiency, timing |

**No real money. No gambling. Just proof of who actually knows ball.**

---


### 🎬 The App (Demo)

<p align="center">
  <img src="./docs/screenshots/demo.gif" width="300" alt="App Demo" />
</p>

## 📱 The App (Screenshots)

| Home | My Bets | Leaderboard |
|:----:|:-------:|:-----------:|
| <img src="https://github.com/user-attachments/assets/06a87eef-19b0-45a6-b92b-80a9437c60e0" width="180" /> | <img src="https://github.com/user-attachments/assets/b25d73f4-cc1e-4ec6-9425-ecd0cb4a4686" width="180" /> | <img src="https://github.com/user-attachments/assets/65d1d1f9-fe97-4210-a66d-b577b53ddb78" width="180" /> |

| My BKS | My BKS (2nd SS) | Account |
|:------:|:---------------:|:-------:|
| <img src="https://github.com/user-attachments/assets/9e09e720-77c9-41f9-b44d-9d98640f2a27" width="180" /> | <img src="https://github.com/user-attachments/assets/295bc10c-532f-4e23-9733-2aa848378ac9" width="180" /> | <img src="https://github.com/user-attachments/assets/32726c32-d222-4434-afa5-fb49068e022d" width="180" /> |

### Features

- **📊 Real-Time Odds** — Live lines from FanDuel, DraftKings, and BetMGM via The Odds API
- **🏈 Multi-Sport Coverage** — NFL, NBA, MLB, NHL
- **🎰 Parlay Builder** — Full sportsbook-style validation (no conflicting legs, correlation limits)
- **📈 Performance Analytics** — Time-series charts, streak tracking, sport-by-sport breakdown
- **🏆 Leaderboards** — Compete with friends and prove your ball knowledge
- **🔐 Secure Auth** — Email/password, Google, and Apple sign-in via Supabase

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE CLIENT                            │
│  React Native · TypeScript · Redux Toolkit · React Navigation   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                             │
│    Node.js · Express · TypeScript · BKS Algorithm Engine        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │  Supabase   │      │    Redis    │      │  External   │
   │  PostgreSQL │      │    Cache    │      │    APIs     │
   │  + Auth     │      │             │      │             │
   └─────────────┘      └─────────────┘      └─────────────┘
```

### Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Mobile** | React Native 0.82, TypeScript, Redux Toolkit, React Navigation 7 |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | Supabase PostgreSQL with Row-Level Security |
| **Caching** | Redis (Upstash) |
| **Auth** | Supabase Auth (OAuth + Email) |
| **APIs** | The Odds API, API-Sports |

### What Got Built

| Metric | Count |
|--------|-------|
| React Native Components | 50+ |
| REST API Endpoints | 25+ |
| Database Tables | 8 (with RLS policies) |
| Background Jobs | 3 (odds sync, bet settlement, BKS calculation) |

---

## 🧠 How This Got Built

**I'm a Product Manager. I don't write production code. But I built this anyway.**

Here's what I mean:

I wrote the PRD. I designed the database schema. I spec'd every API endpoint. I defined the BKS algorithm down to the math. Then I used **[Claude Code](https://claude.ai/code)** as my implementation partner—directing it with detailed prompts, reviewing every output, catching bugs, and iterating until the app actually worked.

### My Process

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Define     │────▶│   Specify    │────▶│   Direct     │────▶│     QA       │
│   Vision     │     │   Technically│     │   Claude     │     │   & Ship     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      │                    │                    │                    │
      ▼                    ▼                    ▼                    ▼
  Product          Architecture          Implementation         Debug &
  Strategy         & Schema              via AI                 Iterate
```

### What I Actually Did

| Phase | My Contribution |
|-------|-----------------|
| **Product Vision** | Conceived BKS concept, defined target users, scoped MVP |
| **Technical Specs** | Wrote PRD with database schema, API contracts, algorithm math |
| **Architecture** | Made decisions on tech stack, caching strategy, auth flow |
| **Prompt Engineering** | Crafted detailed prompts that translated specs into working code |
| **Code Review** | Evaluated every output, caught edge cases, directed fixes |
| **QA & Debugging** | Found bugs, traced issues, iterated until production-ready |

### What I Learned

**AI doesn't replace the need to understand systems. It amplifies it.**

The more precisely I could specify what I wanted, the better the output:
- Vague prompt → broken code
- Detailed spec → working feature

This project took 200+ hours. Not because AI is slow—because *good product work* takes time. Defining requirements, making tradeoffs, catching edge cases, iterating on UX. AI accelerated implementation, but the product thinking was irreducibly human.

### The Thesis

> PMs who deeply understand technology can now ship products, not just manage them.

I'm not claiming to be an engineer. I'm demonstrating that **technical PMs can leverage AI tools to go from idea → working product**—by being precise enough in their specifications that AI can execute on them.

This is where product management is heading. I wanted to get there first.

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- Xcode 15+ (iOS)
- CocoaPods
- [Backend API](https://github.com/yourusername/whoknowsball-backend) running

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/whoknowsball-frontend.git
cd whoknowsball-frontend

# Install dependencies
npm install

# iOS pods
cd ios && pod install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start Metro
npm start

# Run on iOS (in another terminal)
npm run ios
```

See the [Backend Repository](https://github.com/yourusername/whoknowsball-backend) for API setup instructions.

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Account/         # Settings & profile components
│   ├── BetSlip/         # Parlay builder
│   ├── GameCard/        # Game display with odds buttons
│   └── MyBKS/           # Charts and analytics
├── navigation/          # React Navigation config
├── screens/             # Screen components
│   ├── Auth/            # Login, register, verification
│   ├── Home/            # Game browsing by sport
│   ├── MyBets/          # Bet history and tracking
│   └── MyBKS/           # Performance dashboard
├── services/            # API layer and business logic
├── store/               # Redux store, slices, selectors
├── theme/               # Design tokens (colors, typography)
└── types/               # TypeScript definitions
```

---

## 📄 Documentation

- **[Product Requirements Document](./docs/PRD.md)** — Full specs, user stories, and technical requirements
- **[Backend Repository](https://github.com/yourusername/whoknowsball-backend)** — API server and BKS algorithm

---

## 👋 About Me

**Matt Wilson** — Product Manager exploring the frontier of AI-augmented development.

I built WhoKnowsBall to prove a thesis: **PMs who understand technology deeply can leverage AI to ship real products—not by pretending to be engineers, but by being better PMs.**

The ones who can specify systems precisely enough for AI to build them.

Currently seeking PM roles where I can bring this technical depth to product strategy.

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/matthewwoodwilson/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:matthew.wood.wilson@gmail.com)

</div>

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note:** The Ball Knowing Score (BKS) algorithm is proprietary and has been redacted from this public repository. The architecture and integration points are visible, but the scoring logic is not included.

---

<div align="center">

**Built with my buddy Claude, who joined me in mu neverending quest to triumph over my friends and settle arguments in our fantasy sports group chat.**

*Want to know more about my process? Happy to walk through it.*

</div>
