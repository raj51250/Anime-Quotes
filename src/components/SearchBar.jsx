import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({ onSearch, onClear, isSearching, activeQuery }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  const clear = () => {
    setValue("");
    onClear();
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex items-stretch border-[3px] border-ink bg-paper panel-shadow-sm">
        <div className="flex items-center pl-4 text-ink/60">
          <FiSearch size={18} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search a series — Naruto, Bleach, Fairy Tail…"
          aria-label="Search quotes by anime title"
          className="w-full bg-transparent px-3 py-3 font-body text-ink placeholder:text-ink/40 focus:outline-none"
        />
        {activeQuery && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="flex items-center px-3 text-ink/60 hover:text-crimson"
          >
            <FiX size={18} />
          </button>
        )}
        <button
          type="submit"
          disabled={isSearching}
          className="shrink-0 border-l-[3px] border-ink bg-ink px-5 font-display tracking-wide text-paper transition-colors hover:bg-crimson disabled:opacity-60"
        >
          {isSearching ? "…" : "Find"}
        </button>
      </div>
      {activeQuery && (
        <p className="mt-2 text-sm text-sumi">
          Showing results for <span className="font-semibold text-ink">“{activeQuery}”</span>
        </p>
      )}
    </form>
  );
}
