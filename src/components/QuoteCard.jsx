import { motion } from "framer-motion";
import { FiHeart, FiCopy } from "react-icons/fi";
import { PiFilmSlateFill } from "react-icons/pi";
import toast from "react-hot-toast";

const ROTATIONS = ["-rotate-1", "rotate-0", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function QuoteCard({ quote, index = 0, isFavorite, onToggleFavorite }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const anime = quote.anime?.name ?? "Unknown series";
  const character = quote.character?.name ?? "Unknown character";

  const handleCopy = async () => {
    const text = `"${quote.content}" — ${character}, ${anime}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", { className: "font-body" });
    } catch {
      toast.error("Couldn't copy — try again");
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ rotate: 0, y: -4 }}
      className={`group relative flex h-full flex-col justify-between border-[3px] border-ink bg-paper panel-shadow p-5 sm:p-6 transition-shadow duration-200 hover:panel-shadow-crimson ${rotation}`}
    >
      {/* corner tape */}
      <span className="absolute -top-2 left-6 h-4 w-10 -rotate-3 bg-gold/80 border border-ink/40" />

      <div>
        <span
          aria-hidden
          className="block font-display text-6xl leading-none text-crimson select-none"
        >
          &ldquo;
        </span>
        <p className="mt-1 font-display text-[1.15rem] sm:text-xl leading-snug tracking-wide text-ink">
          {quote.content}
        </p>
      </div>

      <div className="mt-5 border-t-2 border-dashed border-ink/30 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-crimson font-display text-sm text-paper">
            {initials(character)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{character}</p>
            <p className="flex items-center gap-1 truncate text-sm text-sumi">
              <PiFilmSlateFill className="shrink-0" aria-hidden />
              {anime}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy quote"
            className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <FiCopy size={16} />
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(quote)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            className={`flex h-9 w-9 items-center justify-center border-2 border-ink transition-colors ${
              isFavorite
                ? "bg-crimson text-paper"
                : "bg-paper text-ink hover:bg-ink hover:text-paper"
            }`}
          >
            <motion.span
              key={isFavorite ? "on" : "off"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="flex"
            >
              <FiHeart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </motion.span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
