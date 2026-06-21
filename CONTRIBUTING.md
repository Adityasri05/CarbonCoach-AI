# Contributing to CarbonCoach AI

Thank you for your interest in contributing to CarbonCoach AI! We welcome contributions from the community to make sustainability tracking more accessible and impactful.

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Git**
- A **Firebase** project (for Authentication & Firestore)
- A **Google Cloud** project with Gemini API and Vision API enabled

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Adityasri05/CarbonCoach-AI.git
cd CarbonCoach-AI

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd carbon-coach-backend && npm install && cd ..

# 4. Create .env.local with your Firebase & API keys
cp .env.example .env.local
# Edit .env.local with your keys

# 5. Run the development server
npm run dev
```

## 📋 Contribution Workflow

### 1. Fork & Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Code Standards

- **TypeScript** — All code must be fully typed (no `any` unless absolutely necessary)
- **ESLint** — Run `npm run lint` before committing. Zero warnings required.
- **Prettier** — Code formatting is enforced via Prettier
- **Semantic HTML** — Use proper ARIA attributes and semantic elements
- **Accessibility** — All UI must meet WCAG 2.1 AA standards

### 3. Testing

- **Backend**: Write Jest unit tests for all service methods
  ```bash
  cd carbon-coach-backend && npm run test:cov
  ```
- **Frontend**: Test key components and context logic
- **Manual**: Test keyboard navigation, screen reader compatibility

### 4. Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add carbon camera image upload
fix: resolve Google Sign-In popup blocking
docs: update API documentation
test: add unit tests for rewards service
refactor: optimize carbon calculation formula
```

### 5. Pull Request

1. Push your branch and open a PR against `main`
2. Fill in the PR template with description, testing steps, and screenshots
3. Ensure CI checks pass (lint, build, tests)
4. Request review from a maintainer

## 🛡️ Code Quality Checklist

Before submitting a PR, verify:

- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run build` compiles without errors
- [ ] `npm audit` shows no critical/high vulnerabilities
- [ ] All new components have proper `aria-label` attributes
- [ ] Color contrast ratios meet WCAG AA (4.5:1)
- [ ] Interactive elements have visible focus indicators
- [ ] New features include documentation updates

## 🐛 Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS version
- Screenshots or console output

## 💡 Feature Requests

Open an issue with:
- Problem description
- Proposed solution
- Impact on existing features

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
