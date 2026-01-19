const express = require("express");
const Listing = require("../models/Listing");
const { normalize, levenshtein } = require("../utils/search");

const router = express.Router();

router.get("/list", (req, res) => {
  try {
    const search = normalize(req.query.search);

    if (!search) {
      const items = Listing.getAll();
      return res.json({ total: items.length, items });
    }

    const candidates = Listing.search(search);
    const base =
      candidates.length > 0 ? candidates : Listing.getAll();

    const ranked = base
      .map((it) => {
        const titleScore = levenshtein(it.game_title, search);
        const platformScore = levenshtein(it.platform, search);
        const regionScore = levenshtein(it.region, search);
        const finalScore = titleScore * 0.7 + Math.min(platformScore, regionScore) * 0.3;
        return { ...it, _score: finalScore };
      })
      .sort((a, b) => a._score - b._score)
      .map(({ _score, ...rest }) => rest);

    res.json({ total: ranked.length, items: ranked });
  } catch (error) {
    console.error("Error in /list endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
