<div align="center">

# 🏀 Who Knows Ball?

**Settle the argument in the group chat, once and for all.**

[![React Native](https://img.shields.io/badge/React_Native-0.82-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

[The Problem](#the-problem) • [The Solution](#the-solution) • [The App](#-the-app) • [Architecture](#-technical-architecture) • [How I Built This](#-how-this-got-built) • [Contact](#-about-me)

</div>

---

## The Problem

Every sports fan thinks they know ball. In every group chat, in every sports bar, there exists the same discussion amongst friends- who actually knows ball? When your buddy claims he "called" the Chiefs winning in OT and points to this as proof of his/her superior ball knowledge, how can you argue? How can you prove them wrong? And how do you do the impossible- get a chiefs fan to stop talking?

Betting apps track money. But **money doesn't measure skill.** A lucky $10 parlay doesn't mean you understand sports better than someone who consistently identifies value in underdogs, or sweats a wild ten legger through sunday night football.

There's currently no standardized way to measure sports betting intelligence, leaving all of these questions unanswered. Until now.

---

## The Solution

WhoKnowsBall is an app built around a proprietary metric called **Ball Knowing Score (BKS)**, a 0-100 rating that quantifies betting skill, not just bankroll size or frequency. A first of it's kind, Ball Knowing Score effectively (and finally) answers the question: Who Knows Ball?

The BKS algorithm evaluates bets across multiple dimensions:

| Dimension | What It Measures |
|-----------|------------------|
| **Difficulty** | Were you betting heavy favorites or finding value in underdogs? |
| **Complexity** | Simple moneyline or sophisticated multi-leg parlay? |
| **Accuracy** | Did you beat the closing line (CLV)? |
| **Stake Significance** | Are you putting conviction behind your picks? |
| **Context** | Game importance, market efficiency, timing |

**No real money. No gambling. Just proof of who actually knows ball.**

---


## 🎬 The App (Demo)

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

**I'm a Product Lead at Google. I don't write production code, and I have only a limited understanding of python at most. But I built this app anyways because I believed there was a significant market gap in a lucrative space where I am both a passionate fan and customer myself.**

It began with a theoretical metric that I came up with ad hoc, while arguing with my friends in our fantasy football group chat: Ball Knowing Score. In its first iteration, it was a simple composite metric that balanced several distinct aspects of a users bet based on their importance, and generated a number from 1-10. Fast forward 6 months, and it has evolved into a complex algorithm that integrates these aspects and combines them with anti-gaming mechanisms, stake-aware scaling, sport-specific calibrations and more. 

My ability to imagine, define, and execute hinged on my technical skillset. As this project progressed and my technical knowledge expanded, I was able to execute something in ~6 months that previously would have taken years.

Two critical tools enabled this build: Claude Opus 4.5 and Claude Code. I wrote the PRD and designed the vision, architecture, database schema, and UI for the app, drinking from the technical firehose as I went. Once completed, I deployed these tools to help bring this vision to life. 

I utilized claude Opus 4.5 as my Associate Product Manager- organinizing, planning, and structuring tasks to be deployed with Claude Code. Generating detailed prompts using the Master-Clone Architecture to speed up production and iterate quickly. Assisting with QA and translating errors into actionable steps. 

I utilized Claude Code as my full-stack engineer- directing it with these detailed prompts, reviewing its every output, catching bugs, and iterating until the app actually worked. Being the Product Lead and a potential user/customer of the app gave me the dual perspective necessary to ensure that not only did it work, but it was actually **fun** to use.

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
| **Prompt Engineering** | Crafted detailed MCA (Master-Clone Architecture) prompts for Claude Code that translated specs into working code |
| **Code Review** | Evaluated every output with real-time simulation, caught edge cases, directed fixes |
| **QA & Debugging** | Found bugs, traced issues, iterated until production-ready |

### What I Learned

**AI doesn't replace the need to understand systems, and will never replace human perspective/curation. But it can amplify it.**

This project took 200+ hours to complete. I'd estimate I spent half of that learning new concepts, and correcting assumptions Claude Code and Opus made on my behalf. These tools enabled me in ways not previously possible, but they are fundamentally designed for computational efficiency- they will always fill gaps with probabilistic assumptions rather than proactively flagging uncertainty (or just refusing to answer). If these assumptions are left unchecked, they can compound into a tasteless product that may be ~70-80% technically sound but lacks true usability (Note- I eventually had to add a templatized addendum to all prompts: "do not make assumptions, ask for clarification"). The exigent gap between technically sound and truly usable can be personified by the criticality of the human perspective, and our ability to curate. Simply put: AI can write code, but it can't feel friction.

Obsessive QA and curation were necessary to close this gap, catching the clunky flows and off center labels, among others. In the end these were resolved and the final product became something worth publishing.

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

- **[Product Requirements Document](./docs/PRD.md)** — Full specs and technical requirements
- **[Backend Repository](https://github.com/yourusername/whoknowsball-backend)** — API server and BKS algorithm

---

## 👋 About Me

**Matt Wilson** — Product Manager exploring the frontier of AI-augmented development.

I built WhoKnowsBall to prove answer two questions: 

**1. Can a PM with the necessary vision, technical skillset, and business acumen build an app despite not having direct programming experience?**

**2. Do I know more about ball than my friends?**

The answer to both of these questions is yes.

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
