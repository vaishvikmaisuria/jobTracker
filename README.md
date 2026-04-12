# jobTracker

A monorepo productivity tracker for job searching and interview prep, with shared domain logic across web and mobile.

The project includes:

- Web app (Next.js) for full dashboard and management workflows
- Mobile app (Expo React Native) for on-the-go tracking
- Shared packages for types, validation, seed data, helpers, and storage repositories
- Adapter-based persistence that keeps UI code decoupled from storage implementation

## Monorepo Structure

```
apps/
  web/       Next.js app (dashboard + management UI)
  mobile/    Expo React Native app
packages/
  types/     Shared enums, entities, filter/sort types
  core/      Zod schemas, seed data, stats + formatting helpers
  storage/   Repository interfaces + sync/async local implementations
```

## Architecture Highlights

- Repository pattern for all domain collections:
    - Jobs
    - Problems
    - Resources
- Storage is abstracted through interfaces and adapters:
    - Sync adapter for browser localStorage workflows
    - Async adapter for React Native AsyncStorage workflows
- Shared validation and business logic live in packages/core and packages/types
- Zustand stores orchestrate app state and call repository methods directly
- Seed data is loaded once per collection via seeded-flag guards

## Tech Stack

- Monorepo: npm workspaces
- Web: Next.js 15, React, Tailwind CSS, Zustand, React Hook Form, Zod
- Mobile: Expo SDK 51, React Native 0.74, Zustand
- Shared packages: TypeScript, Zod, reusable helper modules

## Current Feature Set

### Dashboard (Web)

- Summary cards for applications, active interviews, offers, and solved problems
- Sections for recent applications, active interviews, favorite problems, and saved resources
- Guided walkthrough modal (Feature Guide)

### Job Tracker (Web)

- Full CRUD for job applications
- 12 status options (Applied through Requires Follow-Up)
- Search, status filtering, and sorting
- Detail panel with notes, links, follow-up context, and contact metadata

### LeetCode Tracker (Web + Mobile)

- Track difficulty, type, status, tags, revisions, and favorites
- Completion metrics and solved-rate visibility
- Quick actions (mark solved, favorite toggle)

### Resources Tracker (Web + Mobile)

- Save and categorize learning/job-prep resources
- Filter by category/type and search
- Open links directly from list views

### Data Portability Vault (Web)

- Export all jobs, problems, and resources to JSON backup
- Import backup files with duplicate-id detection
- Skips duplicates automatically and reports import summary

### Mobile Experience

- Tabbed app sections: Dashboard, Jobs, Problems, Resources
- Shared package logic reused from web domain layer
- Async repository implementations backed by AsyncStorage

## Getting Started

### 1) Install dependencies

From repository root:

```bash
npm install
```

### 2) Run apps

From repository root:

- Start web app:

```bash
npm run web
```

- Start Expo dev server:

```bash
npm run mobile
```

- Run iOS build:

```bash
npm run mobile:ios
```

- Run Android build:

```bash
npm run mobile:android
```

## Root Scripts

- npm run web
- npm run mobile
- npm run mobile:ios
- npm run mobile:android
- npm run build:web
- npm run type-check
- npm run type-check:mobile

## Data Model Overview

Shared entities are defined in packages/types:

- Job: application lifecycle, contacts, follow-up flags, salary/link/notes metadata
- Problem: difficulty, status, revision count, solved timeline, favorites
- Resource: categorized external links with notes and tags

## Screenshots

### Dashboard

![Dashboard](https://github.com/user-attachments/assets/09a2be09-24cf-4b2b-a3b1-7e102c62fcd6)

### Job Tracker

![Jobs](https://github.com/user-attachments/assets/617a4367-4c56-4401-b0a9-cfb9759ecbc3)

### LeetCode Tracker

![LeetCode](https://github.com/user-attachments/assets/1efb4d37-7d4f-41c7-95db-ca16a2c53b98)

### Useful Links

![Resources](https://github.com/user-attachments/assets/5f920f2a-1de0-42d7-8450-5c470ef1fb4d)
