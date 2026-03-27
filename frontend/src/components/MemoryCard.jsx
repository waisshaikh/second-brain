export default function MemoryCard({ memory, onDelete }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">

      <h2 className="font-semibold">{memory.title}</h2>

      <p className="text-sm text-gray-400 mt-2 line-clamp-3">
        {memory.content}
      </p>

      {/* TAGS */}
      <div className="flex gap-2 mt-3">
        {memory.tags?.map((tag, i) => (
          <span key={i} className="text-xs bg-cyan-500/20 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-4">
        <a
          href={memory.url}
          target="_blank"
          className="text-cyan-400 text-sm"
        >
          Open
        </a>

        <button
          onClick={() => onDelete(memory._id)}
          className="text-red-400 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}