import { useState } from "react";
import RelatedMemories from "./RelatedMemories";

export default function MemoryCard({ memory, onDelete }) {
  const [showRelated, setShowRelated] = useState(false);

  return (
    <div
      className="bg-white/20 backdrop-blur-xl 
      border border-white/30 rounded-2xl overflow-hidden
      shadow-xl hover:scale-[1.02] transition-all"
    >
      {/* THUMBNAIL */}
      {memory.thumbnail && (
        <img
          src={memory.thumbnail}
          alt="thumbnail"
          className="w-full h-44 object-cover"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <div className="p-5">
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-black line-clamp-2">
          {memory.title || "Untitled"}
        </h2>

        {/* DESCRIPTION */}
        {memory.type === "tweet" ? (
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">
            {memory.content}
          </p>
        ) : (
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">
            {memory.description}
          </p>
        )}

        {/* TAGS */}
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

        {/* ACTIONS */}
        <div className="flex justify-between mt-4 text-sm items-center">
          <a
            href={memory.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open
          </a>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRelated(!showRelated)}
              className="text-purple-600 hover:underline"
            >
              {showRelated ? "Hide" : "Related"}
            </button>

            <button
              onClick={() => onDelete(memory._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* RELATED MEMORIES */}
      {showRelated && (
        <div className="px-5 pb-5">
          <RelatedMemories memoryId={memory._id} />
        </div>
      )}
    </div>
  );
}