<div align="center">

# 🏀🏈🏒 Who Knows Ball?

**Settle the argument in the group chat, once and for all.**

[![React Native](https://img.shields.io/badge/React_Native-0.82-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

[The Problem](#the-problem) • [The Solution](#the-solution) • [App (Demo)](#-app-demo) • [Architecture](#%EF%B8%8F-technical-architecture) • [How And why I Built This](#-how-and-why-i-built-this) • [Contact](#-about-me)

</div>

---

## The Problem

In every group chat, sports bar, or comment section among sports fans, the same debate plays out that can essentially be reduced down to one core question: who actually "knows ball"? 

"Knowing ball" is universal shorthand amongst sports fans used to describe someone with a superior grasp of sports analytics, strategy, and history, and uses this knowledge to effectively predict outcomes. Naturally, sports betting has become a proxy to prove "ball knowledge", with bettors pointing to metrics like ROI and win/loss ratios as proof.

The issue, though, is that betting apps track money, and **money doesn't singularly measure skill.** A lucky $10 parlay doesn't mean you understand sports better than someone who consistently finds value in underdogs, or can sweat a wild ten leg parlay through OT in Sunday Night Football.

There's currently no standardized, comprehensive metric available to measure sports betting intelligence, leaving a sizable market gap among a passionate, engaged audience of sports fans. Until now.

---

## The Solution

WhoKnowsBall is a no-cost, competitive sports betting app built around a proprietary metric called **Ball Knowing Score (BKS)**, a 0-100 rating that quantifies betting skill (not just bankroll size or frequency). A first of it's kind, Ball Knowing Score effectively (and finally) answers the question: "Who knows ball?"

The **BKS algorithm** evaluates bets across multiple dimensions:

| Dimension | What It Measures |
|-----------|------------------|
| **Difficulty** | Were you betting heavy favorites or finding unseen value in underdogs? |
| **Complexity** | Are you firing off simple moneylines or sweating multi-leg parlays? |
| **Accuracy** | Did you beat the closing line (CLV)? |
| **Stake Significance (Stake + Payout)** | Are you putting conviction behind your picks, or playing it safe with low wagers? |
| **Context** | Additional factors: Game importance, market efficiency, timing |


These dimensions, combined with several different anti-gaming safeguards and context-aware functionality, grant users the ability to truly measure their effectiveness as a bettor and quantify their ball knowledge.

**No real money. No gambling. Just proof of who actually knows ball.**

---


## 🎬 App Demo

<p align="center">
  <img src="./docs/screenshots/demo.gif" width="300" alt="App Demo" />
</p>

## 📱 App Screenshots

| Home | My Bets | Leaderboard |
|:----:|:-------:|:-----------:|
| <img src="https://github.com/user-attachments/assets/06a87eef-19b0-45a6-b92b-80a9437c60e0" width="180" /> | <img src="https://github.com/user-attachments/assets/b25d73f4-cc1e-4ec6-9425-ecd0cb4a4686" width="180" /> | <img src="https://github.com/user-attachments/assets/65d1d1f9-fe97-4210-a66d-b577b53ddb78" width="180" /> |

| My BKS | My BKS (2nd SS) | Account |
|:------:|:---------------:|:-------:|
| <img src="https://github.com/user-attachments/assets/9e09e720-77c9-41f9-b44d-9d98640f2a27" width="180" /> | <img src="https://github.com/user-attachments/assets/295bc10c-532f-4e23-9733-2aa848378ac9" width="180" /> | <img src="https://github.com/user-attachments/assets/32726c32-d222-4434-afa5-fb49068e022d" width="180" /> |

### Features

- **📊 Real-Time Odds** — Live lines from major sportsbooks like FanDuel, DraftKings, and BetMGM via integration with The Odds API
- **🏈 Multi-Sport Coverage** — NFL, NCAAF, NBA, MLB, NHL via API-Sports
- **🎰 Parlay Builder** — Full sportsbook-style validation (no conflicting legs, correlation limits)
- **📈 Performance Analytics** — Time-series charts, streak tracking, sport-by-sport breakdown, player badges
- **🏆 Leaderboards** — Compete with friends and prove your ball knowledge
- **🔐 Secure Auth** — Email/password via supabase, Google / Apple TBD

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

## 🧠 How and Why I Built This

It began with an argument in a fantasy football group chat. My friends and I enjoy casual sports betting, and constantly challenge one another over "who knows ball" more than the other. People were posting screenshots of bet slips, their YTD ROI, and their W:L ratios as proof. I realized while sifting through the nonsense, that there was always something missing- ROI didn't account for number of bets, W:L ratio ignored bankroll and bet types, and so on. After scouring dozens of betting apps and spending hours on the internet in search of a metric that included all necessary dimensions, I realized nothing existed. There was no way to quantify a bettors skill across their entire strategy, and more importantly, no way for me to legitimately prove my "ball knowledge" to my friends. Thus, "Ball Knowing Score (BKS)" and the "WhoKnowsBall" app was created. 

In its first iteration, BKS was a simple composite metric that included wager, win/loss, bet type, and odds data, generating a number from 1-10. Fast forward 3 months, and it has evolved into a complex algorithm that integrates several additional aspects of a user's bet and combines them with anti-gaming mechanisms, stake-aware scaling, sport-specific calibrations and more. It serves as the nuclues of the WhoKnowsBall app.

I wrote the PRD and designed the vision, architecture, database schema, and UI. Once I was confident I had a legitimate plan for the MVP, I began building, teaching myself new concepts + skills through painstaking trial and error (insert "drinking from the firehose" metaphor). I eventually was able to ship something in ~3 months that would have previously taken me years. 

Two tools made this possible: Claude Opus 4.5 and Claude Code.

**Claude Opus 4.5: Associate Product Manager:** 
- Organized, planned, and structured tasks to subsequently be deployed with Claude Code
- Generated detailed prompts using the Master-Clone Architecture (task mode + sub agents)
- Assisted with QA and translated errors into actionable fixes
- Reviewed, critiqued, and refined human-generated documentation (PRD, database schema, etc.)
- Soothed my frustration when I repeatedly (accidentally) hit 'Shift+Enter' instead of ' \ + Enter' to start a new line in Claude Code

**Claude Code: Full-Stack Engineer:** 
- Built full-stack infrastructure using MCA prompts with task mode + sub-agents
- Integrated external APIs (The Odds API, API-Sports, Supabase)
- Built parlay validation engine with sportsbook-style rules
- Implemented the BKS algorithm
- Maintained shared context docs across frontend and backend for sub-agent consistency

### My Process

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Define     │────▶│   Specify    │────▶│   Direct     │────▶│     QA       │
│   Vision     │     │   Technically│     │   Claude     │     │   & Ship     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      │                    │                    │                    │
      ▼                    ▼                    ▼                    ▼
  Product          Architecture          Implementation         Debug &
  Strategy         & Schema              via AI                 Iterate (supported by AI)
```

### Overview of Each Phase

| Phase | My Work |
|-------|-----------------|
| **Product Vision** | Conceived BKS concept, defined target users, scoped MVP |
| **Technical Specs** | Wrote PRD with database schema, API contracts, algorithm math |
| **Architecture** | Made decisions on tech stack, caching strategy, auth flow |
| **Prompt Engineering** | Crafted detailed MCA (Master-Clone Architecture) prompts for Claude Code that translated specs into working code |
| **Code Review** | Evaluated every output with real-time simulation, caught edge cases, directed fixes |
| **QA & Debugging** | Found bugs, traced issues, iterated until production-ready |

### What I Learned

**AI doesn't replace the need to understand systems, and will never replace human perspective/curation. But it can amplify it.**

This project took 200+ hours to complete. I'd estimate I spent half of that learning new concepts and correcting assumptions Claude Code and Opus made on my behalf. These tools enabled me in ways not previously possible, but they are fundamentally designed for computational efficiency. They will always fill gaps with probabilistic assumptions rather than proactively flagging uncertainty. Left unchecked, these assumptions can compound into a tasteless product that may be 70-80% technically sound but lacks true usability (Note- I eventually had to add a templatized addendum to all prompts: "do not make assumptions, ask for clarification"). The exigent gap between technically sound and truly usable products in the age of AI is defined by the nuance of human perspective- our ability to curate. Simply put: AI can write code, but it can't feel friction.

My Obsessive QA and curation eventually closed this gap, catching clunky flows, off center labels, and other missteps that a system designed for efficiency would easily overlook. In the end these were resolved and the final product became something worth shipping.

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

- **[Product Requirements Document](PRD.md)** — Full specs and technical requirements
- **[Backend Repository](https://github.com/yourusername/whoknowsball-backend)** — API server and BKS algorithm

---

## 👋 About Me

**Matt Wilson** — Product Manager exploring the frontier of AI-augmented development. 10 total years of experience in tech + media. Certified Ball Knower.

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/matthewwoodwilson/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:matthew.wood.wilson@gmail.com)

</div>

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with my buddy Claude, who joined me in my neverending quest to triumph over my friends and settle arguments in our fantasy sports group chat.**

*Want to know more about my process? Happy to walk through it.*

</div>
