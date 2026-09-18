import { FiTrendingUp } from "react-icons/fi";
import EmptyState from "./EmptyState.jsx";
import QuoteGrid from "./QuoteGrid.jsx";

function SetupNote() {
  return (
    <div className="mx-auto max-w-lg border-[3px] border-dashed border-ink/40 px-6 py-10 text-center">
      <FiTrendingUp size={28} className="mx-auto mb-3 text-ink/40" />
      <p className="font-display text-xl tracking-wide text-ink">
        TRENDING NEEDS A DATA STORE
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-sumi">
        Ranking quotes by favorites across every visitor needs somewhere to
        add those counts up — this app has no server of its own for that.
        Hook up a free Supabase project (a couple of minutes, no credit
        card) and this tab turns into a live leaderboard.
      </p>
      <p className="mt-3 text-xs text-sumi">
        See <span className="font-semibold text-ink">README.md → "Trending"</span> for
        the two-step setup.
      </p>
    </div>
  );
}

export default function TrendingGrid({ enabled, quotes, loading, favorites, onToggleFavorite, coverArtByAnime }) {
  if (!enabled) return <SetupNote />;

  if (!loading && quotes.length === 0) {
    return (
      <EmptyState
        icon={FiTrendingUp}
        title="No favorites yet"
        message="Once visitors start favoriting quotes, the most-loved ones will show up here."
      />
    );
  }

  return (
    <QuoteGrid
      quotes={quotes}
      loading={loading}
      loadingMore={false}
      onLoadMore={() => {}}
      canLoadMore={false}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      coverArtByAnime={coverArtByAnime}
    />
  );
}
