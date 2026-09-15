import { FiGithub, FiHeart } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-paper font-display text-sm">
            言
          </span>
          <p className="font-display tracking-wide">KOTOBA</p>
        </div>

        <p className="text-sm text-paper/70">
          Quotes served by the free{" "}
          <a
            href="https://animechan.io"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-crimson underline-offset-2 hover:text-crimson"
          >
            Animechan API
          </a>
          .
        </p>

        <p className="flex items-center gap-1.5 text-sm text-paper/70">
          Made with <FiHeart className="text-crimson" fill="currentColor" size={13} />
          by
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-display tracking-wide text-paper hover:text-crimson"
          >
            RAJ <FiGithub size={14} />
          </a>
        </p>
      </div>
    </footer>
  );
}
