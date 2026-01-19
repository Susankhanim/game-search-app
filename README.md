# Game Search App

A full-stack game marketplace search application. Frontend renders a game listing UI, backend handles data storage and fuzzy search matching.

## What This Does

You can browse a catalog of games across different platforms (Steam, Xbox, Nintendo) and regions. The search uses fuzzy matching—so searching "split" finds "Split Fiction", searching "slit" also finds it despite the typo. Search is debounced client-side and history is stored in localStorage.

The app doesn't have authentication, payment systems, or actual transactions. It's a working example of client-server integration with real search functionality.

## Architecture

### Frontend (React + Vite)
```
src/
├── App.jsx                 # Main component, manages search state & API calls
├── utils.js                # Constants, utility functions
└── components/
    ├── TopStrip.jsx        # Header banner
    ├── Header.jsx          # Logo + search bar + user menu
    ├── SearchBar.jsx       # Input field with clear button
    ├── SearchHistory.jsx   # Dropdown showing past searches
    ├── UserMenu.jsx        # Favorites, cart, language, avatar buttons
    ├── GameGrid.jsx        # Container for game cards
    └── GameCard.jsx        # Individual game listing with price & cashback
```

**State Flow:**
1. User types in search box → `setSearch()` updates state
2. 250ms debounce timer fires → fetches `/list?search=<query>`
3. Results update → GameGrid re-renders with GameCard components
4. On Enter or selection → `saveHistory()` adds to localStorage

### Backend (Node.js + Express + SQLite)
```
src/
├── app.js                  # Express setup, middleware, routing
├── config/
│   ├── database.js         # SQLite connection with WAL mode
│   └── index.js            # PORT & NODE_ENV config
├── models/
│   └── Listing.js          # Game data class with DB methods
├── routes/
│   └── listings.js         # GET /list endpoint
└── utils/
    └── search.js           # Levenshtein distance & normalization
```

**Search Logic:**
1. Normalize query (lowercase, trim)
2. Run LIKE query across game_title, platform, region
3. Fuzzy-score each result using Levenshtein distance
4. Weight scores: game_title (70%) > platform & region (30%)
5. Sort by score, return results

## Live URLs

- **Frontend:** https://game-search-app-xi.vercel.app/
- **Backend:** https://game-search-app-0aae.onrender.com

## API Endpoints

### `GET /list`
Returns all games in database.

```json
{
  "total": 21,
  "items": [
    {
      "id": 1,
      "game_title": "Split Fiction",
      "platform": "Steam",
      "region": "GLOBAL",
      "price": 40.93,
      "old_price": 49.99,
      "discount_percent": 18,
      "cashback": 4.50,
      "image_url": "/images/splitfiction-1.jpg",
      "likes_count": 626
    }
  ]
}
```

### `GET /list?search=<query>`
Fuzzy searches by game title, platform, or region. Returns matches ranked by similarity.

**Examples:**
- `/list?search=split` → Finds "Split Fiction"
- `/list?search=slit` → Finds "Split Fiction" (typo tolerance)
- `/list?search=xbox` → Finds all Xbox games
- `/list?search=europe` → Finds all EUROPE region listings
- `/list?search=kkk` → Returns empty (no matches)

## Run Locally

### Prerequisites
- Node.js 18+
- npm

### Backend

```bash
cd app/server
npm install
npm run dev
# Runs on http://localhost:3001
```

Database initializes automatically on first run—creates `db.sqlite` with 21 game listings.

### Frontend

```bash
cd app/client
npm install
npm run dev
# Runs on http://localhost:5173
# Set VITE_API_BASE=http://localhost:3001 to hit local backend
```

The app uses `import.meta.env.VITE_API_BASE` to determine backend URL. In production (Vercel), this points to the Render backend. Locally, it defaults to `http://localhost:3001`.

## Project Structure

```
game-search-app/
├── README.md
├── app/
│   ├── client/              # React frontend
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.js
│   └── server/              # Node.js backend
│       ├── src/
│       ├── public/
│       ├── index.js
│       └── package.json
```

## How Search Works

The search combines two approaches:

1. **Exact matching (LIKE):** Database filters records containing the search term
2. **Fuzzy ranking (Levenshtein):** Calculates edit distance between query and each field

This gives you both precision (only showing relevant games) and tolerance (handling typos).

Example: Search "redded"
- LIKE finds nothing
- Returns 0 results (not falling back to all games)

Example: Search "red"
- LIKE finds "Red Dead Redemption 2"
- Levenshtein ranks it perfectly
- Returns ranked results

## Data

The database ships with 21 game listings:
- Split Fiction (multiple platforms/regions/prices)
- Red Dead Redemption 2
- FIFA 23
- Call of Duty

Each listing includes game title, platform, region, pricing, cashback, image, and like count.

## Frontend Features

- **Real-time search** with 250ms debounce
- **Search history** stored in localStorage (max 20 items)
- **Keyboard navigation:** Enter to save search, Escape to close history
- **Click outside detection** to close search dropdown
- **Clear button** in search input
- **Responsive cards** showing price, discount, cashback, likes

## Dependencies

**Client:**
- React 19.2
- Vite 7.2
- ESLint (dev)

**Server:**
- Express 5.2
- better-sqlite3 12.6 (embedded database)
- CORS 2.8
- Nodemon 3.1 (dev)

## Notes

- No auth system—anyone can search
- No real transactions—prices and cart are UI only
- Database is embedded (SQLite file), not a separate service
- Image URLs point to `/public/images/` directory
- Production uses different deployment services (Vercel for client, Render for server)

## Development Approach

This is a clean separation of concerns:
- **Client** handles UI, search state, history, debouncing
- **Server** handles data storage, search algorithm, result ranking

Adding features is straightforward—add a new route in `src/routes/`, add a model method in `src/models/Listing.js`, call it from the frontend.
