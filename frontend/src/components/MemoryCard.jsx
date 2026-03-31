import { useState } from "react";
import RelatedMemories from "./RelatedMemories";

export default function MemoryCard({ memory, onDelete }) {
  const [showRelated, setShowRelated] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case "youtube":
        return "bg-red-500/80";
      case "article":
        return "bg-blue-500/80";
      case "tweet":
        return "bg-sky-400/80";
      case "pdf":
        return "bg-orange-500/80";
      case "image":
        return "bg-purple-500/80";
      default:
        return "bg-gray-500/80";
    }
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/10 
    bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
    shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300">

      {/* 🔥 TYPE BADGE */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-full backdrop-blur-md shadow-md ${getTypeColor(
          memory.type
        )}`}
      >
        {memory.type}
      </div>

      {/* THUMBNAIL */}
      {memory.thumbnail && (
        <img
          src={memory.thumbnail}
          alt="thumbnail"
          className="w-full h-44 object-cover group-hover:scale-105 transition-all duration-300"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <div className="p-5">
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-white line-clamp-2">
          {memory.title || "Untitled"}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-300 mt-2 line-clamp-3">
          {memory.type === "tweet"
            ? memory.content
            : memory.description}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          {memory.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-white/10 text-cyan-300 rounded-full border border-white/10 hover:bg-cyan-400/20 transition"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-4 text-sm items-center">
          <a
            href={memory.url}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Open
          </a>

          <div className="flex gap-4">
            <button
              onClick={() => setShowRelated(!showRelated)}
              className="text-purple-400 hover:text-purple-300 transition"
            >
              {showRelated ? "Hide" : "Related"}
            </button>

            <button
              onClick={() => onDelete(memory._id)}
              className="text-red-400 hover:text-red-300 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* RELATED MEMORIES */}
      {showRelated && (
        <div className="px-5 pb-5 border-t border-white/10">
          <RelatedMemories memoryId={memory._id} />
        </div>
      )}
    </div>
  );
}