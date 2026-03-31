export default function FilterBar({ active, setActive }) {
  const filters = ["all", "youtube", "article", "tweet", "pdf", "image"];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setActive(f)}
          className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all
          ${
            active === f
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}