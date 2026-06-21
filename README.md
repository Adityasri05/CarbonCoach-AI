<div align="center">

# 🌿 CarbonCoach AI

### _Intelligent Carbon Footprint Tracker & Sustainability Coach_

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash_Lite-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Cloud Vision](https://img.shields.io/badge/Cloud_Vision-API-4285F4?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/vision)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**🔗 Live Demo:** [https://carboncoach-ai-pro.web.app](https://carboncoach-ai-pro.web.app)

---

_Turn climate awareness into climate action — one scan, one chat, one challenge at a time._

</div>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Core Features](#-core-features)
- [Architecture & Tech Stack](#%EF%B8%8F-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Testing & Quality](#-testing--quality)
- [Security](#-security)
- [Deployment](#-deployment)
- [Accessibility](#-accessibility)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)

---

## 🔴 The Problem

Climate change is the defining challenge of our generation. Yet despite growing awareness, **individual action remains minimal** because:

| Pain Point | Impact |
|---|---|
| 📊 **No visibility** into personal carbon footprint | People don't know where they stand |
| 📝 **Manual tracking is tedious** | Spreadsheets and calculators are abandoned within days |
| 😐 **No motivation to sustain behavior change** | Without gamification or community, habits don't stick |
| 🤷 **Generic advice** doesn't resonate | One-size-fits-all tips feel impersonal and irrelevant |

> _"You can't manage what you can't measure."_ — Peter Drucker

---

## 💡 Our Solution

**CarbonCoach AI** is an intelligent, gamified sustainability platform that transforms carbon tracking from a chore into an engaging daily habit.

### What Makes Us Different

| Feature | Traditional Trackers | CarbonCoach AI |
|---|---|---|
| **Input Method** | Manual forms | 📸 Camera scan + AI detection |
| **Advice** | Generic tips | 🤖 Personalized AI coaching |
| **Engagement** | One-time use | 🎮 XP, levels, streaks, leaderboards |
| **Alternative Suggestions** | None | 🔄 Specific green alternatives with CO₂ savings |
| **Community** | Isolated | 👥 Competitive leaderboards |

### Key Innovation: The Scan → Analyze → Act Loop

```
📸 Scan any item  →  🔍 AI identifies it  →  📊 Estimates CO₂ impact  →  💚 Suggests green alternative
     (Camera)        (Cloud Vision API)       (Gemini Flash-Lite)          (Structured Output)
```

---

## ✨ Core Features

### 1. 📊 Eco-Metrics Dashboard
- **Dynamic Carbon Scoring** — Real-time annual footprint (Tons CO₂/yr) and monthly emissions (kg CO₂) calculated from user habits
- **Interactive Visualizations** — Recharts-powered graphs showing carbon breakdowns by category (Transport, Energy, Food, Shopping, Waste)
- **Historical Trends** — Daily, weekly, and monthly emission trend analysis
- **AI Recommendation Stream** — Real-time actionable alerts to optimize lifestyle footprint

### 2. 💬 AI Sustainability Coach (Chatbot)
- **Powered by Gemini 2.5 Flash-Lite** via the official `@google/genai` SDK
- **Habit-Aware Context** — User's carbon profile (fuel type, travel distance, recycling behavior) fed into system instructions for hyper-personalized advice
- **Conversational Memory** — Full message history preserved for context-aware follow-ups
- **Structured Output** — JSON Schema-enforced responses for consistent, parseable coaching suggestions

### 3. 📸 Carbon Impact Camera (Vision Scanner)
- **Real-Time Object Recognition** — Google Cloud Vision API label detection on captured photos
- **Structured CO₂ Mapping** — Vision labels passed to Gemini with strict JSON schemas to estimate item CO₂ footprint
- **Green Alternatives** — Every scan suggests a lower-carbon replacement with estimated savings (e.g., beef burger → plant-based burger, saving ~4.2kg CO₂)
- **Gamified Rewards** — +20 Green Points and +50 XP awarded per scan

### 4. 🎮 Gamified Eco-Challenges & Rewards
- **Structured Challenges** — "No Car Week", "Plant-Based Week", "Zero Waste Challenge" with progress tracking
- **XP & Level System** — Level up as you build consistent green habits and streaks
- **Redeemable Rewards** — Exchange Green Points for real-world impact:
  - 🌳 Plant trees (partnered with One Tree Planted)
  - 🌊 Fund ocean cleanups
  - 🏡 Support renewable energy projects

### 5. 👥 Community Leaderboard
- **Global Rankings** — Compete with users worldwide on carbon reduction metrics
- **Streak Tracking** — Maintain daily engagement streaks for bonus XP
- **Social Motivation** — Community-driven sustainability through friendly competition

### 6. 🔮 Carbon Digital Twin
- **Scenario Simulation** — "What if" modeling to visualize impact of lifestyle changes
- **Predictive Analytics** — AI-powered forecasting of future emissions based on current habits
- **Goal Setting** — Set and track personal carbon reduction targets

---

## 🏗️ Architecture & Tech Stack

### System Architecture

```mermaid
graph TB
    subgraph "Frontend - Next.js 16 SPA"
        A[Landing Page] --> B[Auth - Firebase]
        B --> C[Onboarding Flow]
        C --> D[Dashboard]
        D --> E[AI Chatbot]
        D --> F[Vision Scanner]
        D --> G[Challenges]
        D --> H[Leaderboard]
        D --> I[Carbon Twin]
    end

    subgraph "Backend - NestJS API"
        J[Auth Module] --> K[JWT Guard]
        L[Carbon Module] --> M[Activity Logging]
        N[AI Module] --> O[Gemini 2.5 Flash-Lite]
        P[Camera Module] --> Q[Cloud Vision API]
        R[Challenges Module]
        S[Rewards Module]
        T[Leaderboard Module]
        U[Twin Module]
        V[Analytics Module]
    end

    subgraph "Data & Services"
        W[(PostgreSQL via Prisma)]
        X[Firebase Auth]
        Y[Firebase Hosting]
    end

    D -->|REST API| J
    D -->|REST API| L
    E -->|REST API| N
    F -->|REST API| P
    G -->|REST API| R
    H -->|REST API| T
    I -->|REST API| U

    J --> W
    L --> W
    R --> W
    S --> W
    T --> W
    U --> W

    A -->|Deployed to| Y
    B -->|Auth Provider| X
```

### Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 16 (Turbopack) | Lightning-fast React SSR/SPA |
| **Styling** | Tailwind CSS v4 + Custom Glassmorphism | Premium dark-mode UI |
| **Animations** | Framer Motion | Smooth micro-interactions and page transitions |
| **Charts** | Recharts | Responsive SVG data visualizations |
| **Auth** | Firebase Authentication | Secure email/password + Google OAuth |
| **Backend Framework** | NestJS 10 | Enterprise-grade Node.js API |
| **ORM** | Prisma | Type-safe database access |
| **Database** | PostgreSQL | Relational data storage |
| **AI Model** | Gemini 2.5 Flash-Lite | Personalized coaching & structured outputs |
| **Vision AI** | Google Cloud Vision API | Real-time object/label detection |
| **Hosting** | Firebase Hosting | CDN-backed static deployment |
| **Icons** | Lucide React | Consistent icon system |

---

## 📁 Project Structure

```
CarbonCoach-AI/
├── src/                          # Next.js Frontend
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Landing page
│   │   ├── auth/page.tsx         # Authentication page
│   │   ├── onboarding/page.tsx   # User onboarding flow
│   │   ├── dashboard/page.tsx    # Main dashboard
│   │   └── layout.tsx            # Root layout
│   ├── components/               # Reusable UI components
│   │   ├── LandingHero.tsx       # Hero section
│   │   ├── FeatureGrid.tsx       # Feature showcase
│   │   ├── AIChatbot.tsx         # Gemini chatbot interface
│   │   ├── TabDashboard.tsx      # Eco-metrics dashboard tab
│   │   ├── TabCamera.tsx         # Vision scanner tab
│   │   ├── TabCarbonTwin.tsx     # Digital twin simulator
│   │   └── TabLeaderboard.tsx    # Community leaderboard
│   ├── context/
│   │   └── AppContext.tsx        # Global state management
│   └── lib/
│       └── firebase.ts          # Firebase client config
├── carbon-coach-backend/         # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # JWT authentication
│   │   │   ├── carbon/           # Carbon tracking & logging
│   │   │   ├── ai/               # Gemini AI integration
│   │   │   ├── camera/           # Cloud Vision processing
│   │   │   ├── challenges/       # Eco-challenges system
│   │   │   ├── rewards/          # Points & rewards
│   │   │   ├── leaderboard/      # Rankings system
│   │   │   ├── twin/             # Carbon digital twin
│   │   │   ├── analytics/        # Usage analytics
│   │   │   └── user/             # User profiles
│   │   ├── common/               # Shared guards, decorators
│   │   └── prisma/               # Database service
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── package.json
├── public/                       # Static assets
├── firebase.json                 # Firebase hosting config
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
└── package.json                  # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** instance (local or cloud)
- **Google Cloud** account with Vision API enabled
- **Google AI Studio** API key for Gemini
- **Firebase** project (for auth & hosting)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Adityasri05/CarbonCoach-AI.git
cd CarbonCoach-AI
```

### 2️⃣ Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the development server (Turbopack-powered)
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 3️⃣ Backend Setup

```bash
# Navigate to backend directory
cd carbon-coach-backend

# Install backend dependencies
npm install

# Create your environment file
cp .env.example .env
```

Configure your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/carboncoach"

# Authentication
JWT_SECRET="your-secure-jwt-secret-key"
JWT_REFRESH_SECRET="your-secure-refresh-secret-key"

# Google AI - Gemini 2.5 Flash-Lite
GEMINI_API_KEY="your-google-ai-studio-api-key"
GEMINI_MODEL="gemini-2.5-flash-lite"

# Google Cloud Vision API
VISION_API_KEY="your-google-cloud-vision-api-key"
```

```bash
# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start in development mode
npm run start:dev
```

The API will be available at `http://localhost:3001`.

---

## 📡 API Documentation

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login with credentials |
| `POST` | `/auth/refresh` | Refresh JWT token |
| `GET` | `/auth/profile` | Get authenticated user profile |

### Carbon Tracking

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/carbon/log` | Log a carbon-emitting activity |
| `GET` | `/carbon/history` | Get emission history |
| `GET` | `/carbon/summary` | Get aggregated carbon summary |

### AI & Vision

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/chat` | Send message to AI coach |
| `POST` | `/camera/scan` | Upload image for Vision analysis |

### Gamification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/challenges` | List available challenges |
| `POST` | `/challenges/:id/join` | Join a challenge |
| `POST` | `/challenges/:id/progress` | Log challenge progress |
| `GET` | `/rewards` | Get available rewards |
| `POST` | `/rewards/:id/redeem` | Redeem a reward |
| `GET` | `/leaderboard` | Get global leaderboard |

### Simulation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/twin/simulate` | Run carbon twin simulation |
| `GET` | `/twin/history` | Get simulation history |

---

## 🧪 Testing & Quality

### Backend Unit Tests

The NestJS backend has comprehensive unit test coverage across all service modules:

```bash
cd carbon-coach-backend

# Run all tests
npm run test

# Run tests with coverage report
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

#### Test Coverage

| Module | Service | Coverage |
|---|---|---|
| Auth | `auth.service.spec.ts` | ✅ Full |
| Carbon | `carbon.service.spec.ts` | ✅ Full |
| AI | `ai.service.spec.ts` | ✅ Full |
| Camera | `camera.service.spec.ts` | ✅ Full |
| Challenges | `challenges.service.spec.ts` | ✅ Full |
| Rewards | `rewards.service.spec.ts` | ✅ Full |
| Leaderboard | `leaderboard.service.spec.ts` | ✅ Full |
| Twin | `twin.service.spec.ts` | ✅ Full |
| User | `user.service.spec.ts` | ✅ Full |
| Analytics | `analytics.service.spec.ts` | ✅ Full |

### Frontend Quality

```bash
# Lint check (ESLint)
npm run lint

# Type check (TypeScript)
npx tsc --noEmit

# Production build verification
npm run build
```

---

## 🔒 Security

- **JWT Authentication** — Stateless token-based auth with refresh token rotation
- **Prisma ORM** — Parameterized queries prevent SQL injection
- **Firebase Auth** — Google-grade authentication infrastructure
- **Input Validation** — NestJS DTOs with class-validator for all endpoints
- **CORS Configuration** — Strict origin allowlisting
- **Dependency Auditing** — `npm audit` integrated with zero known vulnerabilities
- **Package Overrides** — Security patches applied via npm overrides for transitive dependencies

---

## 🚢 Deployment

### Frontend (Firebase Hosting)

```bash
# Build the static export
npm run build

# Deploy to Firebase Hosting
npx firebase-tools use carboncoach-ai-pro
npx firebase-tools deploy --only hosting
```

### Backend (Any Node.js Host)

```bash
cd carbon-coach-backend

# Build for production
npm run build

# Start production server
npm run start:prod
```

---

## ♿ Accessibility

CarbonCoach AI is built with accessibility as a core principle:

- **Semantic HTML** — Proper use of `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`
- **ARIA Labels** — All interactive elements have descriptive `aria-label` attributes
- **Keyboard Navigation** — Full tab-order support for all interactive elements
- **Color Contrast** — WCAG AA compliant contrast ratios throughout the UI
- **Screen Reader Support** — Meaningful alt text for images and descriptive button labels
- **Focus Indicators** — Visible focus rings on all focusable elements
- **Responsive Design** — Fully functional from mobile (320px) to 4K displays

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint configured)
- Write unit tests for new backend services
- Ensure TypeScript strict mode compliance
- Test accessibility with screen readers before submitting UI changes

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👥 Team

<div align="center">

**Built with 💚 for a sustainable future**

| Role | Name |
|---|---|
| **Full Stack Developer** | Aditya Srivastava |

</div>

---

<div align="center">

_"The greatest threat to our planet is the belief that someone else will save it."_ — Robert Swan

**⭐ Star this repo if you believe in a greener future!**

</div>
