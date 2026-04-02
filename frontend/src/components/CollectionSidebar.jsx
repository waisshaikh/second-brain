import { useEffect, useState } from "react";
import { api } from "../api/index.js";

export default function CollectionSidebar({ active, setActive }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get("/collection").then((res) => setCollections(res.data));
  }, []);

  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-gray-400 text-sm">Collections</h3>

      {collections.map((c) => (
        <div
          key={c._id}
          onClick={() => setActive(c._id)}
          className={`px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2
          ${
            active === c._id
              ? "bg-cyan-500/20 text-cyan-300"
              : "hover:bg-white/10 text-gray-300"
          }`}
        >
          <span>{c.icon}</span>
          {c.name}
        </div>
      ))}
    </div>
  );
}