# CU Snappy

CU Snappy is an equipment rental web app. Members browse a catalogue of cameras, projectors, notebooks and sports gear, then request to borrow items for a date range. Admins manage the equipment list. The friendly camera mascot is called Snappy.

This repository is the **frontend**. It talks to a separate REST API (Express + MongoDB) that stores the data and handles login.

## Features

- Register, log in and log out
- Equipment catalogue with search, sorting and category filters
- Rental requests: create, edit and delete, filter by status
- Return countdown on active rentals
- Admin-only equipment create, edit and delete
- Loading, error and not-found states on every main route

## Tech stack

| Area | Tool |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth.js 4 (credentials login against the API, JWT session) |
| Animation | GSAP |
| Tests | Node built-in test runner |
| Backend | Express + MongoDB Atlas (separate repo) |

## Run the frontend

You need Node.js 20 or newer and a running backend API.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<any long random string>
   ```
   Point `NEXT_PUBLIC_API_URL` at the deployed API instead to use production data.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000.

Optional: with the backend running locally, `node scripts/seed.mjs` adds demo equipment and rentals.

### Other commands

| Command | What it does |
|---|---|
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API, including `/api/v1`. It is public by design. |
| `NEXTAUTH_URL` | The URL this site is served from |
| `NEXTAUTH_SECRET` | Secret used to sign sessions. Keep it private and use a different value in production. |

## Folder structure

```
.
├── public/               Static files
├── scripts/
│   └── seed.mjs          Fills the local backend with demo data
├── docs/                 Planning notes
└── src/
    ├── app/              Routes and layouts (App Router)
    │   ├── api/auth/     NextAuth handler and options
    │   ├── equipment/    Catalogue, add and edit pages
    │   ├── rentals/      Rental list, create and edit pages
    │   ├── login/        Login page
    │   ├── register/     Register page
    │   ├── layout.tsx    Root layout, page title and session provider
    │   └── icon.svg      Tab icon (Snappy)
    ├── components/       Reusable UI (forms, nav, cards, mascot)
    │   └── ui/           Carousel and navbar building blocks
    ├── libs/             API calls and small helpers
    ├── providers/        React context providers
    ├── types/            Shared TypeScript types
    └── __tests__/        Unit tests
```

## Deployment

- **Frontend:** Vercel. Set the three environment variables above.
- **Backend:** Render, with MongoDB Atlas as the database. Its `FRONTEND_URL` setting must exactly match the Vercel URL, with no trailing slash, or the browser blocks the requests (CORS).
