import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import TopStrip from "./components/TopStrip";
import Header from "./components/Header";
import GameGrid from "./components/GameGrid";
import { API_BASE, HISTORY_KEY, HISTORY_LIMIT } from "./utils";

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
    const controller = new AbortController();

    const t = setTimeout(async () => {
      try {
        const url = search
          ? `${API_BASE}/list?search=${encodeURIComponent(search)}`
          : `${API_BASE}/list`;

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setItems([]);
          setTotal(0);
        }
      }
    }, 250);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectHistory = (value) => {
    setSearch(value);
    saveHistory(value);
    setIsHistOpen(false);
  };

  return (
    <div className="page">
      <TopStrip />

      <div className="container">
        <Header
          search={search}
          onSearchChange={handleSearchChange}
          onSearchFocus={() => setIsHistOpen(true)}
          onSearchKeyDown={onKeyDown}
          isHistOpen={isHistOpen}
          filteredHistory={filteredHistory}
          onSelectHistory={handleSelectHistory}
          onClearHistory={clearHistory}
          searchWrapRef={searchWrapRef}
        />

        <div className="results">Results found: {total}</div>

        <GameGrid items={items} />
      </div>
    </div>
  );
}
