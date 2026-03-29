import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [toast, setToast] = useState(null); // { type: "success" | "error" | "loading", message: "" }

  const navigate = useNavigate();

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
    if (!url) {
      setToast({ type: "error", message: "⚠ Please enter a link" });
      return;
    }

    try {
      setIsSaving(true);
      setToast({ type: "loading", message: "🧠 Saving to brain..." });

      await api.post("/memory/save", { url });

      setUrl("");

      // refresh data
      await fetchMemories(search);

      setToast({ type: "success", message: "✅ Memory saved!" });

    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        setToast({ type: "error", message: "🔐 Please login first" });
      } else {
        setToast({ type: "error", message: "❌ Save failed" });
      }
    } finally {
      setIsSaving(false);

      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/memory/${id}`);
      fetchMemories(search);
    } catch (err) {
      console.log(err);
    }
  };

  return (



    <div >
      <AppLayout>

        {/* MAIN */}
        <div className="flex-1 relative p-8">
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

            {/* BACKGROUND BRAIN */}
            {isSaving && (
              <div className="pointer-events-none">
                <BrainCore />
              </div>
            )}



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

            {!loading && memories.length === 0 && (
              <p className="text-gray-400 mt-10 text-center">
                No memories yet
              </p>
            )}
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50">

            <div className={`px-5 py-3 rounded-xl shadow-lg backdrop-blur-xl border
      ${toast.type === "success" && "bg-green-500/10 border-green-400 text-green-300"}
      ${toast.type === "error" && "bg-red-500/10 border-red-400 text-red-300"}
      ${toast.type === "loading" && "bg-cyan-500/10 border-cyan-400 text-cyan-300"}
    `}>

              {toast.message}

            </div>
          </div>
        )}

      </AppLayout>
    </div>
  );
}





