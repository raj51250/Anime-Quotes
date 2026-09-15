import { motion, AnimatePresence } from "framer-motion";
import { FiShuffle } from "react-icons/fi";
import { PiFilmSlateFill } from "react-icons/pi";
import SearchBar from "./SearchBar.jsx";

export default function Hero({ featured, onShuffle, shuffling, searchProps }) {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-ink">
      <div className="halftone absolute inset-0 opacity-[0.06]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block border-2 border-ink bg-gold px-2.5 py-1 font-display text-xs tracking-wide text-ink">
              10,000+ QUOTES
            </span>
            <h1 className="mt-4 font-display text-[13vw] leading-[0.92] tracking-wide text-ink sm:text-6xl lg:text-7xl">
              WORDS THAT
              <br />
              CARRIED THE
              <br />
              <span className="text-crimson">STORY.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              A shelf of lines pulled from your favorite anime — who said it,
              which character, which series. Shuffle for something new, or
              search a show and go straight to its best moments.
            </p>

            <div className="mt-7 max-w-lg">
              <SearchBar {...searchProps} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-sm rotate-1 border-[3px] border-ink bg-paper p-6 panel-shadow bubble-tail">
              <span className="font-display text-6xl leading-none text-crimson">
                &ldquo;
              </span>
              <div className="min-h-[6.5rem]">
                <AnimatePresence mode="wait">
                  {featured && (
                    <motion.p
                      key={featured.content}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-display text-xl leading-snug tracking-wide text-ink"
                    >
                      {featured.content}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-ink/30 pt-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {featured?.character?.name ?? "—"}
                  </p>
                  <p className="flex items-center gap-1 truncate text-sm text-sumi">
                    <PiFilmSlateFill className="shrink-0" aria-hidden />
                    {featured?.anime?.name ?? "Loading…"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <motion.button
                type="button"
                onClick={onShuffle}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 font-display tracking-wide text-paper transition-colors hover:bg-crimson"
              >
                <motion.span
                  animate={shuffling ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex"
                >
                  <FiShuffle size={16} />
                </motion.span>
                NEW QUOTE
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
