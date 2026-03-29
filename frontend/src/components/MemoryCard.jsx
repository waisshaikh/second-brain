export default function MemoryCard({ memory, onDelete }) {
  return (
    <div className="bg-white/20 backdrop-blur-xl 
    border border-white/30 rounded-2xl overflow-hidden
    shadow-xl hover:scale-[1.02] transition-all">

      {/*  THUMBNAIL */}
      {memory.thumbnail && (
        <img
          src={memory.thumbnail}
          alt="thumbnail"
          className="w-full h-44 object-cover"
        />
      )}

      <div className="p-5">

        <h2 className="text-lg font-semibold text-black line-clamp-2">
          {memory.title || "Untitled"}
        </h2>

        {memory.type === "tweet" ? (
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">
            {memory.content}
          </p>
        ) : (
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">
            {memory.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {memory.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <a
            href={memory.url}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Open
          </a>

          <button
            onClick={() => onDelete(memory._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}