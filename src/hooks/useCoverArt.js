import { useEffect, useRef, useState } from "react";
import { getCoverArt } from "../api/jikan.js";

/**
 * Given the current quotes list, resolves (and caches) a cover-art URL
 * per unique anime name and exposes it as { [animeName]: url | null }.
 * New anime names that appear (e.g. after "load more" or a search) are
 * picked up automatically; already-resolved ones are never re-fetched.
 */
export function useCoverArt(quotes) {
  const [artByAnime, setArtByAnime] = useState({});
  const requested = useRef(new Set());

  useEffect(() => {
    const names = new Set(
      quotes.map((q) => q.anime?.name).filter(Boolean)
    );

    for (const name of names) {
      if (requested.current.has(name)) continue;
      requested.current.add(name);

      getCoverArt(name).then((url) => {
        setArtByAnime((prev) =>
          prev[name] === url ? prev : { ...prev, [name]: url }
        );
      });
    }
  }, [quotes]);

  return artByAnime;
}
