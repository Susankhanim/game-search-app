const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));

const db = new Database("db.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_title TEXT NOT NULL,
    platform TEXT NOT NULL,
    region TEXT NOT NULL,
    price REAL NOT NULL,
    old_price REAL,
    discount_percent INTEGER,
    cashback REAL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0
  );
`);

const count = db.prepare("SELECT COUNT(*) as c FROM listings").get().c;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO listings
      (game_title, platform, region, price, old_price, discount_percent, cashback, image_url, likes_count)
    VALUES
      (@game_title, @platform, @region, @price, @old_price, @discount_percent, @cashback, @image_url, @likes_count)
  `);

  const rows = [
    { game_title: "Split Fiction", platform: "Steam", region: "GLOBAL",  price: 40.93, old_price: 49.99, discount_percent: 18, cashback: 4.50, image_url: "/images/splitfiction-1.jpg", likes_count: 626 },
    { game_title: "Split Fiction", platform: "Xbox",  region: "EUROPE",  price: 34.14, old_price: 49.99, discount_percent: 32, cashback: 3.76, image_url: "/images/splitfiction-2.jpg", likes_count: 500 },
    { game_title: "Split Fiction", platform: "Xbox",  region: "GLOBAL",  price: 35.15, old_price: 49.99, discount_percent: 30, cashback: 3.87, image_url: "/images/splitfiction-1.jpg", likes_count: 1039 },
    { game_title: "Split Fiction", platform: "Nintendo", region: "EUROPE", price: 36.25, old_price: 49.99, discount_percent: 27, cashback: 3.99, image_url: "/images/splitfiction-2.jpg", likes_count: 288 },

    { game_title: "Split Fiction", platform: "Steam", region: "EUROPE",  price: 33.90, old_price: 49.99, discount_percent: 32, cashback: 3.10, image_url: "/images/splitfiction-1.jpg", likes_count: 210 },
    { game_title: "Split Fiction", platform: "Steam", region: "GLOBAL",  price: 37.49, old_price: 49.99, discount_percent: 25, cashback: 2.95, image_url: "/images/splitfiction-2.jpg", likes_count: 145 },
    { game_title: "Split Fiction", platform: "Xbox",  region: "EUROPE",  price: 39.99, old_price: 49.99, discount_percent: 20, cashback: 3.30, image_url: "/images/splitfiction-1.jpg", likes_count: 88 },
    { game_title: "Split Fiction", platform: "Nintendo", region: "GLOBAL", price: 41.50, old_price: 49.99, discount_percent: 17, cashback: 2.40, image_url: "/images/splitfiction-2.jpg", likes_count: 61 },

    { game_title: "Split Fiction", platform: "Steam", region: "EUROPE",  price: 38.10, old_price: 49.99, discount_percent: 24, cashback: 3.05, image_url: "/images/splitfiction-1.jpg", likes_count: 132 },
    { game_title: "Split Fiction", platform: "Nintendo", region: "GLOBAL", price: 36.99, old_price: 49.99, discount_percent: 26, cashback: 3.22, image_url: "/images/splitfiction-2.jpg", likes_count: 97 },
    { game_title: "Split Fiction", platform: "Xbox", region: "EUROPE",    price: 34.49, old_price: 49.99, discount_percent: 31, cashback: 3.60, image_url: "/images/splitfiction-1.jpg", likes_count: 305 },
    { game_title: "Split Fiction", platform: "Nintendo", region: "EUROPE", price: 35.99, old_price: 49.99, discount_percent: 28, cashback: 3.10, image_url: "/images/splitfiction-2.jpg", likes_count: 154 },

    { game_title: "Red Dead Redemption 2", platform: "Steam", region: "EUROPE", price: 31.99, old_price: 59.99, discount_percent: 47, cashback: 0.35, image_url: "/images/rdr2.jpg", likes_count: 50 },
    { game_title: "Red Dead Redemption 2", platform: "Steam", region: "GLOBAL", price: 29.99, old_price: 59.99, discount_percent: 50, cashback: 0.40, image_url: "/images/rdr2.jpg", likes_count: 640 },
    { game_title: "Red Dead Redemption 2", platform: "Xbox",  region: "GLOBAL", price: 27.99, old_price: 59.99, discount_percent: 53, cashback: 0.30, image_url: "/images/rdr2.jpg", likes_count: 301 },
    { game_title: "Red Dead Redemption 2", platform: "Nintendo", region: "EUROPE", price: 28.49, old_price: 59.99, discount_percent: 52, cashback: 0.33, image_url: "/images/rdr2.jpg", likes_count: 2000 },

    { game_title: "FIFA 23", platform: "Steam", region: "GLOBAL", price: 19.99, old_price: 59.99, discount_percent: 67, cashback: 0.25, image_url: "/images/fifa23-1.jpg", likes_count: 478 },
    { game_title: "FIFA 23", platform: "Xbox",  region: "GLOBAL", price: 24.99, old_price: 69.99, discount_percent: 64, cashback: 0.20, image_url: "/images/fifa23-2.jpg", likes_count: 900 },
    { game_title: "FIFA 23", platform: "Steam", region: "EUROPE", price: 21.99, old_price: 59.99, discount_percent: 63, cashback: 0.22, image_url: "/images/fifa23-3.jpg", likes_count: 167 },

    { game_title: "Call of Duty", platform: "Steam", region: "EUROPE", price: 49.99, old_price: 69.99, discount_percent: 29, cashback: 0.50, image_url: "/images/cd1.jpg", likes_count: 3000 },
    { game_title: "Call of Duty", platform: "Xbox",  region: "GLOBAL", price: 44.99, old_price: 69.99, discount_percent: 36, cashback: 0.45, image_url: "/images/cd2.jpg", likes_count: 2400 },
  ];

  const tx = db.transaction((items) => items.forEach((r) => insert.run(r)));
  tx(rows);
}

function norm(s) {
  return String(s || "").toLowerCase().trim();
}

app.get("/list", (req, res) => {
  const search = norm(req.query.search);

  if (!search) {
    const all = db.prepare("SELECT * FROM listings ORDER BY id DESC").all();
    return res.json({ total: all.length, items: all });
  }

  const like = `%${search}%`;
  const candidates = db
    .prepare("SELECT * FROM listings WHERE lower(game_title) LIKE ? ORDER BY id DESC")
    .all(like);

  const base = candidates.length > 0
    ? candidates
    : db.prepare("SELECT * FROM listings ORDER BY id DESC").all();

  function levenshtein(a, b) {
    a = norm(a); b = norm(b);
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  const ranked = base
    .map((it) => ({ ...it, _score: levenshtein(it.game_title, search) }))
    .sort((a, b) => a._score - b._score)
    .map(({ _score, ...rest }) => rest);

  res.json({ total: ranked.length, items: ranked });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
