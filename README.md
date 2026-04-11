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
```

Persistence is fully abstracted — `LocalJobRepository` implements `IJobRepository`; swapping to `MongoJobRepository` requires no UI changes.

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

<!-- START COPILOT CODING AGENT SUFFIX -->



<!-- START COPILOT ORIGINAL PROMPT -->



<details>

<summary>Original prompt</summary>

Build a production-quality Job Hunt Tracker app with a shared architecture for 3 platforms:
Use Next.js for the web app and Expo React Native for mobile.
React Web
React Native Android
React Native iOS
For web UI use Tailwind CSS + a clean component system. For mobile use React Native Paper or a small custom component library with shared design tokens.
Structure the storage layer so I can later switch from localStorage/AsyncStorage to an API + MongoDB without changing UI code.
The app should feel polished, structured, and scalable, like it was written by a senior engineer.
Follow SOLID principles, clean architecture, feature-first folder organization, reusable abstractions, proper typing, and separation of concerns.

Product goal

Create a personal productivity app inspired by a Notion-style tracker/dashboard for job searching and interview prep.

The app must contain 3 main sections:

Job Application Tracker
LeetCode Tracker
Useful Links

The UI should take inspiration from:

table/database style trackers
clean productivity tools
Notion-like cards, status pills, tabs, filters, and detail views
simple, minimal, modern design
Tech requirements
Frontend

Use:

TypeScript
React for web
React Native for mobile
Shared reusable business logic and models between web and mobile
Reusable UI primitives where possible
Proper form handling and validation
Responsive design on web
Mobile-friendly native screens for Android and iOS
State management

Use a scalable approach such as:

Zustand or Redux Toolkit
Separate domain logic from UI state
Avoid tightly coupling components to storage implementation
Local persistence for initial stage

For now, store everything locally:

Web: localStorage
React Native: AsyncStorage

Abstract persistence behind a common repository/storage interface so that later it can be swapped to backend easily.

Backend-ready architecture

Prepare the project so it can later support:

MongoDB
Redis (optional, for caching / session / fast lookup)
REST API or modular service layer

Important:

I already have a MongoDB connection file, but for now do not depend on backend
Build the app with an architecture that makes future backend integration easy
Add clear TODO hooks / interfaces for future MongoDB + Redis support
Architecture requirements

Design the codebase with a monorepo-style or shared workspace structure if possible.

Suggested structure:

apps/web
apps/mobile
packages/ui
packages/core
packages/storage
packages/types
packages/utils

Or another clean scalable structure with the same idea:

shared domain models
shared validation
shared repository interfaces
shared business logic
platform-specific UI implementations only where needed
Coding standards

Everything must be:

strongly typed
modular
readable
reusable
testable
maintainable
extensible

Follow:

SOLID principles
DRY
clear naming
dependency inversion
composition over inheritance
feature-based modular design
no huge files
no duplicated logic
no inline business logic inside screens
no hardcoded magic values without constants/enums

Use:

interfaces/types for entities
repository pattern for persistence
service/use-case layer for business logic
custom hooks for feature logic
reusable presentational components
platform adapters for storage
App sections and feature requirements
1. Job Application Tracker

Create a full tracker for jobs with CRUD support.

Job fields

Each job application item should support:

id
companyName
location
status
roleOrPosition
mainContact
contactEmail
contactPhone
dateApplied
lastContact
likelihoodOfHiring
tags
coverLetterOrResumeLink
notes
salaryRange (optional)
jobPostingUrl (optional)
priority (optional)
createdAt
updatedAt
Job statuses

Include enums / constants for statuses like:

Applied
Recruiter Reachout
OA Scheduled
OA Completed
Interviewing
Final Round
Negotiating Offer
Offer Received
Rejected
Ghosted
On Hold
Requires Follow-Up
Job tracker features

Implement:

list/table view
card view for mobile
create job
edit job
delete job
search
filter by status
filter by tags
sort by date applied / last contact / company
status badge colors
open details screen/page
notes section per job
follow-up reminder flag
quick update actions for status
empty states
seeded demo data for first app launch
UX inspiration

UI should resemble a simple productivity database:

top tabs
clean table on web
cards/list on mobile
colored status pills
detail modal or dedicated page
sticky filters/search on top
2. LeetCode Tracker

Create a tracker for coding practice and interview prep.

Problem fields

Each problem should support:

id
name
url
type
difficulty
status
topicTags
attemptedAt
solvedAt
notes
revisionCount
isFavorite
createdAt
updatedAt
Difficulty values
Easy
Medium
Hard
Status values
Not Started
Attempted
Solved
Needs Revision
Problem tracker features

Implement:

table/list view
create problem
edit problem
delete problem
mark solved
mark attempted
filter by type
filter by difficulty
filter by status
search by name
completion s...

</details>

