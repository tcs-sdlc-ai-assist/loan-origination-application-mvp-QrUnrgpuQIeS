# Deployment Guide: Loan Origination MVP

---

## Overview

This document describes how to deploy the **Loan Origination MVP** to production, including environment variables, Vercel configuration, and CI/CD notes.

---

## 1. Deployment Platform

- **Recommended:** [Vercel](https://vercel.com/) (static hosting, zero-config for Vite + React)
- **Alternative:** Any static hosting (Netlify, S3+CloudFront, GitHub Pages, etc.)

---

## 2. Build & Output

- **Build Command:** `npm run build`
- **Output Directory:** `dist/` (default for Vite)

---

## 3. Environment Variables

Copy `.env.example` to `.env` and fill in as needed.

**Supported variables:**

- `VITE_API_URL` — (optional) API endpoint (not used in MVP, for future use)
- `VITE_FEATURE_FLAG` — (optional) Feature toggles
- `VITE_OTHER_SECRET` — (optional) Any other secrets (not used in MVP)

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the client.

---

## 4. Vercel Configuration

A `vercel.json` file is included:

```
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures client-side routing works (SPA fallback to `index.html`).

**Vercel Project Settings:**

- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Add any needed `VITE_*` variables in the Vercel dashboard

---

## 5. Deployment Steps

### One-time setup

1. **Push code to GitHub/GitLab**
2. **Connect repository to Vercel**
3. **Set environment variables** in Vercel dashboard (if needed)
4. **Deploy**

### Manual build & preview

```
npm install
npm run build
npm run preview
```

Open [http://localhost:4173](http://localhost:4173) to preview the production build.

---

## 6. CI/CD Notes

- **Vercel** automatically builds and deploys on every push to the main branch.
- **Tests:** All component/unit tests run locally via `npm run test` (uses Vitest).
- **No backend:** All data is stored in browser localStorage. No serverless functions or API routes are used.
- **No secrets:** Do not store real secrets in `.env` or Vercel dashboard for this MVP.

---

## 7. Static Hosting Caveats

- **Client-side routing:** The included `vercel.json` ensures SPA fallback. For other hosts, configure rewrites to serve `index.html` for all routes.
- **No SSR:** This is a pure static SPA. No server-side rendering.
- **No authentication:** Demo login only; not suitable for production use.

---

## 8. Support

For deployment issues, contact the project owner or internal engineering team.

---

**End of Deployment Guide**