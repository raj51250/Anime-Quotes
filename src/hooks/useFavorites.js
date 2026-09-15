import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kotoba:favorites";

export function quoteId(quote) {
  return `${quote.anime?.name ?? ""}::${quote.character?.name ?? ""}::${quote.content}`;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* storage unavailable, ignore */
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (quote) => favorites.some((f) => quoteId(f) === quoteId(quote)),
    [favorites]
  );

  const toggleFavorite = useCallback((quote) => {
    setFavorites((prev) => {
      const id = quoteId(quote);
      const exists = prev.some((f) => quoteId(f) === id);
      return exists
        ? prev.filter((f) => quoteId(f) !== id)
        : [quote, ...prev];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
