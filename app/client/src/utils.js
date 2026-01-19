import steamLogo from "./assets/steam.png";
import xboxLogo from "./assets/xbo.png";
import ninLogo from "./assets/nin2.png";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
export const HISTORY_KEY = "search_history_v1";
export const HISTORY_LIMIT = 20;

export const pickPlatformLogo = (platform) => {
  const p = String(platform || "").toLowerCase();
  if (p.includes("steam")) return steamLogo;
  if (p.includes("xbox")) return xboxLogo;
  if (p.includes("nin") || p.includes("nintendo") || p.includes("switch")) return ninLogo;
  return null;
};

export const coverUrl = (it) => {
  const raw = String(it?.image_url || "");
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  return `${API_BASE}/${raw}`;
};
