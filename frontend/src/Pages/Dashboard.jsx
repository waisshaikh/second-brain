import { useEffect, useState, useMemo } from "react";
import { api } from "../api/index.js";
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
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);



  const fetchCollections = async () => {
  try {
    const res = await api.get("/collection");
    setCollections(res.data);
  } catch (err) {
    console.log(err);
  }
};

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

    //fetch collections
    api.get("/collection")
      .then(res => setCollections(res.data))
      .catch(err => console.log(err));

  }, []);


  // FILTER LOGIC

const filteredMemories = useMemo(() => {
  let data = memories;

  if (activeCollection === null) return data;

  if (activeCollection === "ALL_COLLECTIONS") {
    return data.filter((m) => m.collections?.length > 0);
  }

  return data.filter((m) =>
    m.collections?.map(String).includes(activeCollection)
  );

}, [memories, activeCollection]);

console.log("MEMORIES:", memories);
console.log("ACTIVE:", activeCollection);



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
      setToast({ type: "error", message: "❌ login required" });
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
   <AppLayout 
  setActiveCollection={setActiveCollection}
  collections={collections} 
  refreshCollections={fetchCollections}
>
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

    {/*  COLLECTION FILTER */}
    <div className="flex gap-3 mt-5 flex-wrap">

      {/* ALL */}
      <button
        onClick={() => setActiveCollection(null)}
        className={`px-4 py-1.5 rounded-full text-sm transition
        ${
          activeCollection === null
            ? "bg-cyan-500 text-black"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        All
      </button>

      {/* DYNAMIC COLLECTIONS */}
      {collections.map((c) => (
        <button
          key={c._id}
          onClick={() => setActiveCollection(c._id)}
          className={`px-4 py-1.5 rounded-full text-sm transition flex items-center gap-2
          ${
            activeCollection === c._id
              ? "bg-cyan-500 text-black"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          <span>{c.icon}</span>
          {c.name}
        </button>
      ))}
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
          collections={collections} // ✅ PASS HERE ALSO
          refreshMemories={fetchMemories}
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





