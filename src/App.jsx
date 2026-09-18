import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FiHeart } from "react-icons/fi";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import QuoteGrid from "./components/QuoteGrid.jsx";
import TrendingGrid from "./components/TrendingGrid.jsx";
import Footer from "./components/Footer.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import EmptyState from "./components/EmptyState.jsx";
import PwaUpdater from "./components/PwaUpdater.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";

import {
  getRandomQuote,
  getRandomQuotes,
  getQuotesByAnime,
} from "./api/animechan.js";
import {
  isTrendingEnabled,
  getTrendingQuotes,
  bumpFavoriteCount,
} from "./api/trending.js";
import { FALLBACK_QUOTES } from "./data/fallbackQuotes.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { useCoverArt } from "./hooks/useCoverArt.js";

const PAGE_SIZE = 9;

export default function App() {
  const [view, setView] = useState("home"); // "home" | "favorites" | "trending"
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const [featured, setFeatured] = useState(null);
  const [shuffling, setShuffling] = useState(false);

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);

  const [trendingQuotes, setTrendingQuotes] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const trendingFetched = useRef(false);

  const fallbackCursor = useRef(0);
  const seenContent = useRef(new Set());

  // Cover art is resolved for whatever's currently on screen, across all
  // three views, and merged into one lookup table by anime name.
  const homeCoverArt = useCoverArt(quotes);
  const favoritesCoverArt = useCoverArt(favorites);
  const trendingCoverArt = useCoverArt(trendingQuotes);
  const featuredCoverArt = useCoverArt(featured ? [featured] : []);
  const coverArtByAnime = {
    ...homeCoverArt,
    ...favoritesCoverArt,
    ...trendingCoverArt,
    ...featuredCoverArt,
  };

  const nextFallbackBatch = useCallback((n) => {
    const batch = [];
    for (let i = 0; i < n; i++) {
      batch.push(FALLBACK_QUOTES[fallbackCursor.current % FALLBACK_QUOTES.length]);
      fallbackCursor.current += 1;
    }
    return batch;
  }, []);

  const handleToggleFavorite = (quote) => {
    const wasFavorite = isFavorite(quote);
    toggleFavorite(quote);
    toast.success(wasFavorite ? "Removed from favorites" : "Added to favorites");
    bumpFavoriteCount(quote, wasFavorite ? -1 : 1);
  };

  const refreshFeatured = useCallback(async () => {
    setShuffling(true);
    try {
      const q = await getRandomQuote();
      setFeatured(q);
    } catch {
      setFeatured(nextFallbackBatch(1)[0]);
    } finally {
      setTimeout(() => setShuffling(false), 400);
    }
  }, [nextFallbackBatch]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [featuredQuote, batch] = await Promise.all([
          getRandomQuote(),
          getRandomQuotes(PAGE_SIZE),
        ]);
        if (cancelled) return;
        setFeatured(featuredQuote);
        batch.forEach((q) => seenContent.current.add(q.content));
        setQuotes(batch);
      } catch {
        if (cancelled) return;
        setUsingFallback(true);
        const batch = nextFallbackBatch(PAGE_SIZE);
        batch.forEach((q) => seenContent.current.add(q.content));
        setFeatured(batch[0]);
        setQuotes(batch);
        toast(
          "Live API is resting (rate limit) - showing a bundled quote pack.",
          { icon: "📖", duration: 4500 }
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch trending lazily, the first time that tab is opened.
  useEffect(() => {
    if (view !== "trending" || trendingFetched.current || !isTrendingEnabled) return;
    trendingFetched.current = true;
    setTrendingLoading(true);
    getTrendingQuotes()
      .then(setTrendingQuotes)
      .catch(() => toast.error("Couldn't load trending quotes right now."))
      .finally(() => setTrendingLoading(false));
  }, [view]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      if (usingFallback) {
        const batch = nextFallbackBatch(6);
        setQuotes((prev) => [...prev, ...batch]);
      } else {
        const batch = await getRandomQuotes(6);
        const fresh = batch.filter((q) => !seenContent.current.has(q.content));
        fresh.forEach((q) => seenContent.current.add(q.content));
        if (fresh.length === 0) {
          toast("That's every fresh quote the API has right now.", { icon: "🍃" });
        }
        setQuotes((prev) => [...prev, ...fresh]);
      }
    } catch {
      toast.error("Couldn't load more right now - try again shortly.");
    } finally {
      setLoadingMore(false);
    }
  };

  const runSearch = async (query, page = 1) => {
    setSearching(true);
    try {
      const results = await getQuotesByAnime(query, page);
      if (page === 1) {
        setQuotes(results ?? []);
      } else {
        setQuotes((prev) => [...prev, ...(results ?? [])]);
      }
      setSearchHasMore((results ?? []).length >= 10);
      setSearchQuery(query);
      setSearchPage(page);
      setUsingFallback(false);
    } catch {
      if (page === 1) setQuotes([]);
      setSearchHasMore(false);
      setSearchQuery(query);
      toast.error("No luck searching \"" + query + "\" - try another series title.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (query) => {
    setView("home");
    runSearch(query, 1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchHasMore(true);
    setSearchPage(1);
    setLoading(true);
    getRandomQuotes(PAGE_SIZE)
      .then((batch) => {
        seenContent.current = new Set(batch.map((q) => q.content));
        setQuotes(batch);
        setUsingFallback(false);
      })
      .catch(() => {
        const batch = nextFallbackBatch(PAGE_SIZE);
        setQuotes(batch);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  };

  const isSearchMode = Boolean(searchQuery);

  return (
    <div className="flex min-h-screen flex-col">
      <PwaUpdater />
      <InstallPrompt />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            border: "2px solid #14110F",
            borderRadius: 0,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            background: "#F5EFE1",
            color: "#14110F",
          },
        }}
      />

      <Navbar
        view={view}
        onChangeView={(v) => {
          setView(v);
          if (v === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        favoritesCount={favorites.length}
      />

      {view === "home" && (
        <Hero
          featured={featured}
          coverArt={featured ? coverArtByAnime[featured.anime?.name] : null}
          onShuffle={refreshFeatured}
          shuffling={shuffling}
          searchProps={{
            onSearch: handleSearch,
            onClear: handleClearSearch,
            isSearching: searching,
            activeQuery: searchQuery,
          }}
        />
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {view === "favorites" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl tracking-wide text-ink">
                YOUR SHELF
              </h2>
              <span className="border-2 border-ink px-2.5 py-1 font-display text-xs">
                {favorites.length} SAVED
              </span>
            </div>
            <QuoteGrid
              quotes={favorites}
              loading={false}
              loadingMore={false}
              onLoadMore={() => {}}
              canLoadMore={false}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              coverArtByAnime={coverArtByAnime}
              emptyState={
                <EmptyState
                  icon={FiHeart}
                  title="Your shelf is empty"
                  message="Tap the heart on any quote card to pin it here."
                />
              }
            />
          </>
        )}

        {view === "trending" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl tracking-wide text-ink">
                MOST LOVED
              </h2>
              {isTrendingEnabled && (
                <span className="border-2 border-teal bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
                  live across all visitors
                </span>
              )}
            </div>
            <TrendingGrid
              enabled={isTrendingEnabled}
              quotes={trendingQuotes}
              loading={trendingLoading}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              coverArtByAnime={coverArtByAnime}
            />
          </>
        )}

        {view === "home" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl tracking-wide text-ink">
                {isSearchMode ? "RESULTS" : "FRESH OFF THE PAGE"}
              </h2>
              {usingFallback && !isSearchMode && (
                <span className="border-2 border-gold bg-gold/20 px-2.5 py-1 text-xs font-semibold text-ink">
                  offline pack
                </span>
              )}
            </div>

            <QuoteGrid
              quotes={quotes}
              loading={loading}
              loadingMore={loadingMore || searching}
              onLoadMore={
                isSearchMode
                  ? () => runSearch(searchQuery, searchPage + 1)
                  : handleLoadMore
              }
              canLoadMore={isSearchMode ? searchHasMore : true}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              coverArtByAnime={coverArtByAnime}
            />
          </>
        )}
      </main>

      <Footer />
      <ScrollTopButton />
    </div>
  );
}
