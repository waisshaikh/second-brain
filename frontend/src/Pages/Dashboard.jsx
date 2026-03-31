import { useEffect, useState, useMemo } from "react";
import { api } from "../api";
import MemoryCard from "../components/MemoryCard";
import BrainCore from "../components/BrainCore";
import AppLayout from "../layouts/AppLayout";

export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/memory");
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

  // LOCAL FILTER (INSTANT + SMOOTH)
  const filteredMemories = useMemo(() => {
    if (!search) return memories;

    return memories.filter((m) => {
      const text =
        `${m.title} ${m.description} ${m.tags?.join(" ")}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [search, memories]);

  const handleSave = async () => {
    if (!url) {
      setToast({ type: "error", message: "⚠ Enter a link bro" });
      return;
    }

    try {
      setIsSaving(true);
      setToast({ type: "loading", message: "🧠 Saving to brain..." });

      await api.post("/memory/save", { url });

      setUrl("");
      await fetchMemories();

      setToast({ type: "success", message: "🧠 Memory stored!" });
    } catch (err) {
      setToast({ type: "error", message: "❌ Failed bro" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/memory/${id}`);
    fetchMemories();
  };

  return (
    <AppLayout>
      <div className="flex-1 relative p-8">

        {/*  TOP GLASS PANEL */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search your brain..."
            className="w-full mb-4 px-5 py-3 rounded-xl bg-black/40 border border-white/10 
            text-white placeholder-gray-400 focus:border-cyan-400 outline-none transition"
          />

          {/* SAVE BAR */}
          <div className="flex gap-3">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste anything (YouTube, article, tweet...)"
              className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/10 
              text-white placeholder-gray-400 focus:border-cyan-400 outline-none"
            />

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 
              text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              Save
            </button>
          </div>
        </div>

        {/*  BRAINCORE */}
        {isSaving && (
          <div className="pointer-events-none">
            <BrainCore />
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {filteredMemories.map((mem) => (
            <MemoryCard
              key={mem._id}
              memory={mem}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {!loading && filteredMemories.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            No memories found 🧠
          </p>
        )}

        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <div
              className={`px-5 py-3 rounded-xl backdrop-blur-xl border shadow-lg
              ${toast.type === "success" && "bg-green-500/10 border-green-400 text-green-300"}
              ${toast.type === "error" && "bg-red-500/10 border-red-400 text-red-300"}
              ${toast.type === "loading" && "bg-cyan-500/10 border-cyan-400 text-cyan-300"}
            `}
            >
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}