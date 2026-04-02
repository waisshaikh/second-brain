import { useState } from "react";
import { api } from "../api/index.js";

export default function MemoryCard({ 
  memory, 
  onDelete, 
  collections = [], 
  refreshMemories 
}) {

  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const getTypeColor = (type) => {
    switch (type) {
      case "youtube": return "bg-red-500";
      case "article": return "bg-blue-500";
      case "tweet": return "bg-sky-400";
      case "pdf": return "bg-orange-500";
      case "image": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const handleSave = async () => {
    if (!selectedCollection) return;

    try {
      await api.post("/collection/add", {
        memoryId: memory._id,
        collectionId: selectedCollection,
      });

      await refreshMemories();
      setShowModal(false);
      setSelectedCollection(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="relative group rounded-2xl overflow-hidden border border-white/10 
      bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl 
      shadow-lg hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] 
      hover:scale-[1.03] transition-all duration-300">

        {/*  HOVER ACTIONS */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
        flex items-center justify-center gap-4 transition duration-300 z-20">

          <a
            href={memory.url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-cyan-400 text-black rounded-lg text-sm"
          >
            Open
          </a>

          <button
            onClick={() => onDelete(memory._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
          >
            Delete
          </button>
        </div>

        {/*  TYPE BADGE */}
        <div className={`absolute top-3 right-3 px-3 py-1 text-xs text-white rounded-full ${getTypeColor(memory.type)}`}>
          {memory.type}
        </div>

        {/*  DATE */}
        <div className="absolute top-3 left-3 text-xs text-gray-300 bg-black/40 px-2 py-1 rounded backdrop-blur">
          {formatDate(memory.createdAt)}
        </div>

        {/*  IMAGE */}
        {memory.thumbnail && (
          <div className="overflow-hidden">
            <img
              src={memory.thumbnail}
              alt=""
              className="w-full h-44 object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>
        )}

        <div className="p-5 relative z-10">

          {/* TITLE */}
          <h2 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-cyan-300 transition">
            {memory.title || "Untitled"}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-400 mt-2 line-clamp-3">
            {memory.type === "tweet"
              ? memory.content
              : memory.description}
          </p>

          {/*  TAGS (FIXED) */}
          <div className="flex flex-wrap gap-2 mt-3">
            {memory.tags?.length > 0 ? (
              memory.tags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-white/5 text-cyan-300 rounded-full border border-white/10"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No tags</span>
            )}

            {memory.tags?.length > 4 && (
              <span className="text-xs text-gray-400">
                +{memory.tags.length - 4}
              </span>
            )}
          </div>

          {/*  BOTTOM BAR */}
          <div className="flex justify-between items-center mt-5 text-xs text-gray-400">

            <span className="capitalize">
              {memory.type}
            </span>

            <span>
              {memory.tags?.length || 0} tags
            </span>

          </div>

        </div>

        {/*  ADD BUTTON */}
        <div className="absolute bottom-3 right-3 z-30">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 text-xs bg-cyan-500 text-black rounded-lg"
          >
            + Add
          </button>
        </div>

      </div>

      {/*  MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="w-[350px] bg-[#020617] border border-white/10 rounded-2xl p-6">

            <h2 className="text-white text-lg mb-4">
              Add to Collection
            </h2>

            <select
              value={selectedCollection || ""}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white mb-4"
            >
              <option value="">Select collection</option>

              {collections.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-cyan-500 text-black rounded"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}