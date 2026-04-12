# jobTracker

Create a personal productivity app inspired by a Notion-style tracker/dashboard for job searching and interview prep.

Personal productivity tracker for job searching and interview prep, built as a monorepo with a swap-ready persistence layer.

## Architecture

```
packages/
  types/    – shared enums + entity interfaces (Job, Problem, Resource)
  storage/  – IJobRepository / IProblemRepository / IResourceRepository
              + LocalStorage implementations (drop-in replaceable with Mongo)
  core/     – Zod schemas, seed data, color maps, formatters
apps/
  web/      – Next.js 15 + React 18 + Tailwind CSS
  mobile/   – Expo React Native (Android + iOS)
```

Persistence is fully abstracted — `LocalJobRepository` implements `IJobRepository`; swapping to `MongoJobRepository` requires no UI changes.

For mobile, async repositories use injected storage adapters (`IAsyncStorageAdapter`) and run on top of Expo AsyncStorage without coupling domain logic to React Native APIs.

## Run Apps

From repo root:

- `npm install`
- `npm run web` to start Next.js on web
- `npm run mobile` to start Expo dev server
- `npm run mobile:ios` to run iOS simulator build
- `npm run mobile:android` to run Android emulator build

Type checks:

- `npm run type-check`
- `npm run type-check:mobile`

## Features

**Job Application Tracker**

- Table view with 12 status pills (Applied → Offer Received → Rejected etc.)
- Click-to-expand side detail panel with all fields, links, notes
- CRUD via modal forms, search + status filter + date/company sort, follow-up flag

**LeetCode Tracker**

- Easy / Medium / Hard difficulty badges, completion stats (solved %, favorites)
- Mark-solved quick action, per-problem revision count and notes

**Useful Links**

- Card grid grouped by category, type-colored badges, direct external link open
- CRUD + search + category/type filters

**Dashboard**

- Quick stats: total applications, active interviews, offers, solved problems
- Recent applications, active interviews, favorite problems, saved resources

## State Management

Zustand stores call repository methods directly; seed data is written to localStorage on first launch via a seeded-key guard.

## Screenshots

### Dashboard

![Dashboard](https://github.com/user-attachments/assets/09a2be09-24cf-4b2b-a3b1-7e102c62fcd6)

### Job Tracker – table + detail panel

![Jobs](https://github.com/user-attachments/assets/617a4367-4c56-4401-b0a9-cfb9759ecbc3)

### LeetCode Tracker

![LeetCode](https://github.com/user-attachments/assets/1efb4d37-7d4f-41c7-95db-ca16a2c53b98)

### Useful Links

![Resources](https://github.com/user-attachments/assets/5f920f2a-1de0-42d7-8450-5c470ef1fb4d)
