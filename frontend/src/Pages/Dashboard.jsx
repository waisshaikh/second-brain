import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BrainCore from "../components/BrainCore";
import { api } from "../api";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  //  FETCH MEMORIES
  const fetchMemories = async (query = "") => {
    try {
      setLoading(true);

      const res = await api.get(
        query
          ? `/memory/semantic?query=${query}`
          : "/memory"
      );

      setMemories(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //  INITIAL LOAD
  useEffect(() => {
    fetchMemories();
  }, []);

  //  LIVE SEARCH (DEBOUNCE)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMemories(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  //  SAVE MEMORY
  const handleSave = async () => {
    if (!url) return;

    await api.post("/memory/save", { url });
    setUrl("");
    fetchMemories(search);
  };

  return (
    <div className="relative min-h-screen px-6 py-6 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          <span className="text-cyan-400">Second</span>{" "}
          <span className="text-purple-400">Brain</span>
        </h1>
      </div>

       

      {/* SEARCH */}
      <div className="mt-10 relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything..."
          className="w-full p-5 pl-14 rounded-2xl bg-white/5 border border-white/10"
        />
      </div>

      {/* SAVE */}
      <div className="mt-6 flex gap-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste link..."
          className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10"
        />

        <button
          onClick={handleSave}
          className="px-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl"
        >
          Save
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="mt-6 text-gray-400">Loading...</p>
      )}

      <BrainCore/>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {memories.map((mem) => (
          <motion.div
            key={mem._id}
            whileHover={{ scale: 1.05 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold">{mem.title}</h2>

            <p className="text-sm text-gray-400 mt-2 line-clamp-3">
              {mem.content}
            </p>

            <div className="flex gap-2 mt-4 text-xs">
              {mem.tags?.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-cyan-500/20 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}