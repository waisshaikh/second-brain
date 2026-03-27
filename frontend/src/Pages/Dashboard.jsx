import { useEffect, useState } from "react";
import { api } from "../api";
import MemoryCard from "../components/MemoryCard";
import BrainCore from "../components/BrainCore";

export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 GET MEMORIES
  const fetchMemories = async (query = "") => {
    try {
      setLoading(true);

      const res = await api.get(
        query ? `/memory/semantic?query=${query}` : "/memory"
      );

      setMemories(res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchMemories();
  }, []);

  // 🔥 SEARCH (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMemories(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // 🔥 SAVE MEMORY
  const handleSave = async () => {
    if (!url) return;

    try {
      await api.post("/memory/save", { url });
      setUrl("");
      fetchMemories(search);
    } catch (err) {
      console.log("Save Error:", err);
    }
  };

  // 🔥 DELETE MEMORY
  const handleDelete = async (id) => {
    try {
      await api.delete(`/memory/${id}`);
      fetchMemories(search);
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-cyan-400">
        Second Brain
      </h1>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your brain..."
        className="w-full mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
      />

      {/* SAVE */}
      <div className="flex gap-3 mt-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste link..."
          className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10"
        />

        <button
          onClick={handleSave}
          className="px-6 bg-cyan-500 rounded-xl"
        >
          Save
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="mt-4 text-gray-400">Loading...</p>}

      

      <BrainCore/>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {memories.map((mem) => (
          <MemoryCard
            key={mem._id}
            memory={mem}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && memories.length === 0 && (
        <p className="mt-6 text-gray-500">
          No memories yet. Start saving 🚀
        </p>
      )}
    </div>
  );
}