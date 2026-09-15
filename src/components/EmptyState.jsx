export default function EmptyState({ title, message, icon: Icon }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center border-[3px] border-dashed border-ink/40 px-6 py-14 text-center">
      {Icon && <Icon size={30} className="mb-3 text-ink/40" aria-hidden />}
      <p className="font-display text-xl tracking-wide text-ink">{title}</p>
      <p className="mt-2 text-sm text-sumi">{message}</p>
    </div>
  );
}
