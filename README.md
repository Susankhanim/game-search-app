# Game Search App

A small full-stack web app (React + Node.js + SQLite) that replicates the provided UI and supports game listing + search.

## Live URLs
- Frontend (Vercel): https://game-search-app-xi.vercel.app/
- Backend (Render): https://game-search-app-0aae.onrender.com

## API
- `GET /list`
- `GET /list?search=<gamename>` (supports fuzzy matching)

Example:
- https://game-search-app-0aae.onrender.com/list
- https://game-search-app-0aae.onrender.com/list?search=split

## Run locally

### Backend
```bash
cd server
npm install
npm run dev
