import { FiHeart, FiGithub, FiTrendingUp } from "react-icons/fi";

export default function Navbar({ view, onChangeView, favoritesCount }) {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onChangeView("home")}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-ink font-display text-lg text-paper">
            言
          </span>
          <span className="font-display text-2xl tracking-wide text-ink">
            KOTOBA
          </span>
        </button>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onChangeView("home")}
            className={`hidden border-2 border-ink px-3 py-1.5 text-sm font-semibold transition-colors sm:block ${
              view === "home"
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-paper-dim"
            }`}
          >
            Browse
          </button>

          <button
            type="button"
            onClick={() => onChangeView("trending")}
            aria-label="View trending quotes"
            className={`flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-sm font-semibold transition-colors ${
              view === "trending"
                ? "bg-teal text-paper"
                : "bg-paper text-ink hover:bg-paper-dim"
            }`}
          >
            <FiTrendingUp size={15} />
            <span className="hidden sm:inline">Trending</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView("favorites")}
            aria-label="View favorites"
            className={`relative flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-sm font-semibold transition-colors ${
              view === "favorites"
                ? "bg-crimson text-paper"
                : "bg-paper text-ink hover:bg-paper-dim"
            }`}
          >
            <FiHeart
              size={15}
              fill={view === "favorites" ? "currentColor" : "none"}
            />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 font-display text-[11px] text-ink">
                {favoritesCount}
              </span>
            )}
          </button>

          <a
            href="https://github.com/raj51250"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            className="hidden h-9 w-9 items-center justify-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper sm:flex"
          >
            <FiGithub size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
