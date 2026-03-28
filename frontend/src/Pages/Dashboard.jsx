import { useEffect, useState } from "react";
import { api } from "../api";
import MemoryCard from "../components/MemoryCard";
import BrainCore from "../components/BrainCore";

export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMemories = async (query = "") => {
    try {
      setLoading(true);
      const res = await api.get(
        query ? `/memory/semantic?query=${query}` : "/memory"
      );
      setMemories(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMemories(search);
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleSave = async () => {
    if (!url) return;
    await api.post("/memory/save", { url });
    setUrl("");
    fetchMemories(search);
  };

  const handleDelete = async (id) => {
    await api.delete(`/memory/${id}`);
    fetchMemories(search);
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 p-6 border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-cyan-400 mb-8">
          🧠 Second Brain
        </h1>

        <div className="space-y-4 text-gray-300">
          <p className="hover:text-cyan-400 cursor-pointer">📚 Library</p>
          <p className="hover:text-cyan-400 cursor-pointer">🧠 Graph</p>
          <p className="hover:text-cyan-400 cursor-pointer">⚡ Recent</p>
          <p className="hover:text-cyan-400 cursor-pointer">⚙ Settings</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 relative p-8">

        {/* 🧠 BACKGROUND BRAIN */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div className="brain-bg">
            <BrainCore />
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10">

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your brain..."
            className="w-full bg-white/20 backdrop-blur-xl 
            border border-white/30 rounded-xl px-5 py-3
            text-black placeholder-gray-600"
          />

          {/* SAVE */}
          <div className="flex gap-4 mt-4">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste link..."
              className="flex-1 bg-white/20 backdrop-blur-xl 
              border border-white/30 rounded-xl px-5 py-3
              text-black placeholder-gray-600"
            />

            <button
              onClick={handleSave}
              className="px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 
              text-white shadow-lg"
            >
              Save
            </button>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {memories.map((mem) => (
              <MemoryCard
                key={mem._id}
                memory={mem}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* EMPTY */}
          {!loading && memories.length === 0 && (
            <p className="text-gray-400 mt-10 text-center">
              No memories yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}