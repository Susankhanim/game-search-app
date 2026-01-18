import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import enebaPng from "./assets/eneba.png";

import fifa1 from "./assets/fifa23-1.jpg";
import fifa2 from "./assets/fifa23-2.jpg";
import fifa3 from "./assets/fifa23-3.jpg";

import cod1 from "./assets/cd1.jpg";
import cod2 from "./assets/cd2.jpg";

import rdr2 from "./assets/rdr2.jpg";

import split1 from "./assets/splitfiction-1.jpg";
import split2 from "./assets/splitfiction-2.jpg";

import ltFlag from "./assets/lt.png";
import searchIcon from "./assets/search.svg";
import heartIcon from "./assets/heart.svg";
import cartIcon from "./assets/card.svg";

import clockIcon from "./assets/time.svg";

import steamLogo from "./assets/steam.png";
import xboxLogo from "./assets/xbo.png";
import ninLogo from "./assets/nin2.png";

import topLogoPng from "./assets/toplogo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const HISTORY_KEY = "search_history_v1";
const HISTORY_LIMIT = 8;

export default function App() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [history, setHistory] = useState([]);
  const [isHistOpen, setIsHistOpen] = useState(false);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (Array.isArray(saved)) setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target)) setIsHistOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      const url = search
        ? `${API_BASE}/list?search=${encodeURIComponent(search)}`
        : `${API_BASE}/list`;

      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    }, 250);

    return () => clearTimeout(t);
  }, [search]);

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return history;
    return history.filter((h) => h.toLowerCase().includes(q));
  }, [history, search]);

  const saveHistory = (value) => {
    const q = value.trim();
    if (!q) return;

    setHistory((prev) => {
      const next = [q, ...prev.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(
        0,
        HISTORY_LIMIT
      );
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      saveHistory(search);
      setIsHistOpen(false);
    }
    if (e.key === "Escape") {
      setIsHistOpen(false);
    }
  };

  const pickPlatformLogo = (platform) => {
    const p = String(platform || "").toLowerCase();
    if (p.includes("steam")) return steamLogo;
    if (p.includes("xbox")) return xboxLogo;
    if (p.includes("nin") || p.includes("nintendo") || p.includes("switch")) return ninLogo;
    return null;
  };

  const pickCover = (it) => it.image_url || "";
    const title = (it.game_title || "").toLowerCase();

    if (title === "split fiction") return index % 2 === 0 ? split1 : split2;

    if (title === "fifa 23") {
      const k = index % 3;
      return k === 0 ? fifa1 : k === 1 ? fifa2 : fifa3;
    }

    if (title === "red dead redemption 2") return rdr2;

    if (title.startsWith("call of duty")) {
      return index % 2 === 0 ? cod1 : cod2;
    }

    return it.image_url;
  };

  return (
    <div className="page">
      <div className="topStrip">
        <div className="topStripInner">
          <img className="topLogo" src={topLogoPng} alt="Eneba" />
          <span className="topText">Games, Gift Cards, Top-Ups & More | Best Deals</span>
        </div>
      </div>

      <div className="container">
        <header className="header">
          <div className="logo">
            <img className="logoIcon" src={enebaPng} alt="Eneba" />
          </div>

          <div className="searchWrap" ref={searchWrapRef}>
            <img className="iconImg" src={searchIcon} alt="" aria-hidden="true" />

            <input
              className="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsHistOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search"
              autoComplete="off"
              spellCheck={false}
            />

            {search ? (
              <button className="clear" onClick={() => setSearch("")} aria-label="Clear" type="button">
                ✕
              </button>
            ) : null}

            {isHistOpen && filteredHistory.length > 0 ? (
              <div className="histDrop">
                {filteredHistory.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className="histItem"
                    onClick={() => {
                      setSearch(h);
                      saveHistory(h);
                      setIsHistOpen(false);
                    }}
                  >
                    <img className="histIconImg" src={clockIcon} alt="" aria-hidden="true" />
                    <span className="histText">{h}</span>
                  </button>
                ))}

                <div className="histFooter">
                  <button type="button" className="histClear" onClick={clearHistory}>
                    Clear history
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="right">
            <div className="lang">
              <img className="flagImg" src={ltFlag} alt="Lithuania" />
              <span>English EU | EUR</span>
            </div>

            <button className="miniBtn" aria-label="Favorites" type="button">
              <img className="miniIcon" src={heartIcon} alt="" aria-hidden="true" />
            </button>

            <button className="miniBtn" aria-label="Cart" type="button">
              <img className="miniIcon" src={cartIcon} alt="" aria-hidden="true" />
            </button>

            <div className="avatar">A</div>
          </div>
        </header>

        <div className="results">Results found: {total}</div>

        <div className="grid">
          {items.map((it, idx) => {
            const pLogo = pickPlatformLogo(it.platform);

            return (
              <div className="card" key={it.id}>
                <div className="imgWrap">
                  <img className="img" src={pickCover(it)} alt={it.game_title} />


                  <div className="badge">
                    <span className="badgeIcon">+</span>
                    <span>CASHBACK</span>
                  </div>

                  <div className="platformBar">
                    {pLogo ? (
                      <img className="platformLogo" src={pLogo} alt="" aria-hidden="true" />
                    ) : null}
                    <span className="platformText">{it.platform}</span>
                  </div>
                </div>

                <div className="cardBody">
                  <div className="cardTitle">{it.game_title}</div>

                  <div className="cardRegion">{it.region}</div>

                  <div className="cardSub">
                    From <span className="oldInline">€{Number(it.old_price || 0).toFixed(2)}</span>{" "}
                    <span className="discInline">-{it.discount_percent || 0}%</span>
                  </div>

                  <div className="cardPriceRow">
                    <div className="bigPrice">€{Number(it.price).toFixed(2)}</div>
                    <img className="langTimeIcon" src={clockIcon} alt="" aria-hidden="true" />
                  </div>

                  <div className="cashRow">
                    <span className="cashLabel">Cashback:</span>
                    <span className="cashValue">€{Number(it.cashback || 0).toFixed(2)}</span>
                  </div>

                  <div className="likeRow">
                    <img className="histIconImg" src={heartIcon} alt="" aria-hidden="true" />
                    <span className="likeCount">{it.likes_count ?? 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
