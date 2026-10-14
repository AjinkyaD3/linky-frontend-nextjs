# Linky frontend

The web app for [Linky](https://github.com/AjinkyaD3/linky): landing page, authentication, the link dashboard, and public link-in-bio pages.
It is a client of the [Spring Boot API](https://github.com/AjinkyaD3/linky-backend-springboot) and is **not** in the redirect path:
short links point straight at the backend.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
[![CI](https://github.com/AjinkyaD3/linky-frontend-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/AjinkyaD3/linky-frontend-nextjs/actions/workflows/ci.yml)

## Features

- Landing page with anonymous quick-shorten
- Dashboard: create links (alias, password, one-time, expiry, UTM builder, smart routing), **bulk create**, tags, favourites, archive
- Link detail: edit destination, expiry and routing rules; analytics (clicks, browsers, devices, countries, cities, referrers); **QR customiser** with a contrast warning
- **Pages** (link-in-bio editor) and the server-rendered public page at `/p/[slug]`
- **Webhooks** management with a delivery log
- API keys, profile and settings, admin page, light/dark theme ("Ink & Ember"), responsive layout

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · React Hook Form + Zod · Radix UI primitives · Recharts · Zustand · next-themes · Sonner

## Run it

```bash
cp .env.local.example .env.local      # NEXT_PUBLIC_API_URL=http://localhost:8080
npm ci
npm run dev -- -p 4300                # http://localhost:4300
```

Start the backend with `FRONTEND_URL=http://localhost:4300` and `CORS_ALLOWED_ORIGINS=http://localhost:4300`, or the browser will report CORS errors
and password-reset links will point at the wrong port.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | backend origin (also used to build the Content-Security-Policy) |
| `NEXT_PUBLIC_SITE_URL` | canonical public origin for metadata, sitemap and social images |

## Scripts

```bash
npm run dev       # development server
npm run build     # production build (also type-checks)
npm run lint      # ESLint, including React Compiler rules
npm test          # unit tests for the helper logic (Node's built-in test runner)
bash scripts/smoke.sh http://localhost:4300     # routes, 404, title and security headers against a running build
```

## How it talks to the API

`src/lib/api-client.ts` wraps `fetch`: it attaches the access token (held in memory only), and on a `401` makes **one shared refresh call**
and retries the request once. The refresh token and basic user info persist in `localStorage` so a reload keeps the session
(`src/lib/auth-store.ts`). Server state is cached with TanStack Query; forms use React Hook Form with Zod schemas that mirror the backend validation.

## Layout

```
src/app/          routes: (auth), (dashboard), /p/[slug], /unlock/[shortCode], /link-error, legal pages
src/components/   dashboard/* (feature components), ui/* (hand-styled primitives), home/*
src/lib/          api-client, api, auth-store, types, link-tools (UTM, dates, contrast, bulk parsing), site, utils
scripts/smoke.sh  post-build / post-deploy smoke test
```

## CI/CD

GitHub Actions: lint, type-check, unit tests, build, serve the build and smoke-test it, `npm audit`, CodeQL, Dependabot.
Vercel deploys through its Git integration; a post-deploy workflow smoke-tests each deployment URL.
