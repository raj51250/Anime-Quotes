import { motion } from "framer-motion";
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
}) {
  const favoriteIds = new Set(favorites.map((f) => quoteId(f)));

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
          />
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-10 flex justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onLoadMore}
            disabled={loadingMore}
            className="border-2 border-ink bg-paper px-6 py-2.5 font-display tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            {loadingMore ? "LOADING…" : "LOAD MORE"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
