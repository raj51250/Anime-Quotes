export default function Loader({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse border-[3px] border-ink/20 bg-paper-dim panel-shadow-sm"
        />
      ))}
    </div>
  );
}
