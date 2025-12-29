<div align="center">

# 🏀 WhoKnowsBall

### A Sports Betting Skill Tracker - Quantify Your Ball Knowledge

[![React Native](https://img.shields.io/badge/React_Native-0.82-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.9-764ABC?style=flat&logo=redux)](https://redux-toolkit.js.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

[Features](#-features) • [Architecture](#-architecture) • [Setup](#-setup) • [About](#-about-this-project)

</div>

---

## 📱 Demo

> Video demo coming soon - drag and drop your demo video here when editing on GitHub

<details>
<summary>📸 Screenshots</summary>

| Home | My Bets | My BKS | Account |
|:----:|:-------:|:------:|:-------:|
| Coming Soon | Coming Soon | Coming Soon | Coming Soon |

</details>

---

## ✨ Features

- **🎯 Ball Knowing Score (BKS)** - Proprietary algorithm that quantifies betting skill on a 0-100 scale
- **📊 Real-Time Odds** - Live odds from major sportsbooks via The Odds API
- **🏈 Multi-Sport Support** - NFL, NBA, MLB, NHL coverage
- **📈 Performance Analytics** - Track your betting performance over time with interactive charts
- **🎰 Parlay Builder** - Build and track complex multi-leg parlays with validation
- **🏆 Leaderboards** - Compete with friends and prove your ball knowledge
- **🔐 Secure Auth** - Email/password and OAuth (Google, Apple) via Supabase
- **📱 Cross-Platform** - iOS and Android support with React Native

---

## 🏗️ Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│   React Native App  │────▶│   Node.js Backend   │
│   (This Repo)       │     │   (bks-backend)     │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌───────────┐      ┌───────────┐      ┌───────────┐
            │ Supabase  │      │   Redis   │      │ External  │
            │ (Auth/DB) │      │  (Cache)  │      │   APIs    │
            └───────────┘      └───────────┘      └───────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native 0.82 |
| **Language** | TypeScript 5.0 |
| **State Management** | Redux Toolkit |
| **Navigation** | React Navigation 7 |
| **Authentication** | Supabase Auth |
| **Charts** | React Native Skia |
| **Storage** | MMKV |

---

## 🚀 Setup

### Prerequisites

- Node.js 18+
- Xcode 15+ (iOS)
- Android Studio (Android)
- CocoaPods

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/whoknowsball-frontend.git
cd whoknowsball-frontend

# Install dependencies
npm install

# iOS only - install pods
cd ios && pod install && cd ..

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Account/       # Account settings components
│   ├── BetSlip/       # Bet slip and parlay builder
│   ├── GameCard/      # Game display with odds
│   └── MyBKS/         # BKS analytics charts
├── navigation/        # React Navigation setup
├── screens/           # Screen components
│   ├── Account/       # Profile & settings
│   ├── Auth/          # Login, register, verification
│   ├── Home/          # Game browsing
│   ├── MyBets/        # Bet history
│   └── MyBKS/         # Performance dashboard
├── services/          # API and business logic
├── store/             # Redux store and slices
├── theme/             # Design system (colors, typography)
└── types/             # TypeScript definitions
```

---

## 👨‍💼 About This Project

### The PM Behind It

This project was built by **Matt Wilson**, a Product Manager demonstrating technical leadership through AI-augmented development.

**My Role:**
- 🎯 **Product Vision** - Defined the concept of quantifying "Ball Knowledge" into a measurable score
- 📋 **Technical PRD** - Wrote comprehensive specifications including the BKS algorithm design
- 🏗️ **Architecture Decisions** - Designed system architecture, database schema, and API contracts
- 🤖 **AI-Augmented Development** - Directed Claude Code as full-stack engineer
- ✅ **Quality Assurance** - Conducted thorough QA testing and iteration

### AI-Powered Development

This project showcases a modern PM workflow:
- **Claude Code** served as the full-stack engineer, implementing features from my specifications
- I served as the technical PM, making all product decisions and directing development

This demonstrates that modern PMs can leverage AI tools to ship production-quality software while focusing on product strategy, user experience, and technical direction.

---

## 📬 Contact

**Matt Wilson** - Product Manager

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/matthewwoodwilson/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat&logo=gmail)](mailto:matthew.wood.wilson@gmail.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The Ball Knowing Score (BKS) algorithm is proprietary and has been redacted from this public repository.

---

<div align="center">

Built with ☕ and 🤖 by Matt Wilson

</div>
