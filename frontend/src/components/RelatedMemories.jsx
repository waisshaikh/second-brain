import { useEffect, useState } from "react";
import { api } from "../api/index.js";

export default function RelatedMemories({ memoryId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!memoryId) return;

    const load = async () => {
      try {
        const res = await api.get(`/memories/${memoryId}/related`);
        setRelated(res.data);
      } catch (err) {
        console.error("Related fetch error:", err);
      }
    };

    load();
  }, [memoryId]);

  if (!related.length) {
    return <p className="text-gray-400 text-sm mt-2">No related found</p>;
  }

  return (
    <div className="mt-3">
      <h3 className="text-white text-sm mb-2">Related</h3>

      <div className="flex gap-3 overflow-x-auto">
        {related.map((mem) => (
          <div
            key={mem._id}
            className="min-w-[180px] bg-black/30 p-2 rounded-lg"
          >
            {mem.thumbnail && (
              <img
                src={mem.thumbnail}
                className="h-20 w-full object-cover rounded"
              />
            )}

            <p className="text-xs mt-2 line-clamp-2 text-white">
              {mem.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}