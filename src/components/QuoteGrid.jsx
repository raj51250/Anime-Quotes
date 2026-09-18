import { useEffect, useRef } from "react";
import QuoteCard from "./QuoteCard.jsx";
import Loader from "./Loader.jsx";
import EmptyState from "./EmptyState.jsx";
import { FiHeart } from "react-icons/fi";
import { quoteId } from "../hooks/useFavorites.js";

export default function QuoteGrid({
  quotes,
  loading,
  loadingMore,
  onLoadMore,
  canLoadMore,
  favorites,
  onToggleFavorite,
  emptyState,
  coverArtByAnime,
}) {
  const favoriteIds = new Set(favorites.map((f) => quoteId(f)));
  const sentinelRef = useRef(null);

  // Keep the latest values in refs so the observer (created once) always
  // acts on current state without needing to be torn down and rebuilt
  // every time the quote list grows — rebuilding it on every append is
  // what causes runaway "load more" loops, since a freshly (re)observed
  // target fires its callback immediately with the current intersection
  // state even when nothing actually changed.
  const stateRef = useRef({ loadingMore, canLoadMore, onLoadMore });
  stateRef.current = { loadingMore, canLoadMore, onLoadMore };

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const { loadingMore, canLoadMore, onLoadMore } = stateRef.current;
        if (entries[0].isIntersecting && canLoadMore && !loadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: "600px 0px 600px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (loading) return <Loader />;

  if (!quotes.length) {
    return (
      emptyState ?? (
        <EmptyState
          icon={FiHeart}
          title="Nothing here yet"
          message="Try a different search, or head back to browse."
        />
      )
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote, i) => (
          <QuoteCard
            key={`${quoteId(quote)}-${i}`}
            quote={quote}
            index={i}
            isFavorite={favoriteIds.has(quoteId(quote))}
            onToggleFavorite={onToggleFavorite}
            coverArt={coverArtByAnime?.[quote.anime?.name]}
          />
        ))}
      </div>

      {/* Sentinel that triggers the next page as it scrolls into view.
          Always mounted (even when canLoadMore is false) so the observer
          set up above doesn't need to be recreated when it flips true. */}
      <div ref={sentinelRef} className="mt-10 flex justify-center py-4">
        {canLoadMore && loadingMore && (
          <span className="font-display text-sm tracking-wide text-sumi">
            LOADING MORE…
          </span>
        )}
      </div>
    </div>
  );
}
