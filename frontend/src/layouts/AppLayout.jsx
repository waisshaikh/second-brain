import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api";

export default function AppLayout({ 
  children, 
  setActiveCollection, 
  collections = [],
  refreshCollections // 🔥 IMPORTANT
}) {
  const navigate = useNavigate();

  const [active, setActive] = useState("LIBRARY");
  const [newCollection, setNewCollection] = useState("");
  const [editingId, setEditingId] = useState(null);

  //  CREATE COLLECTION (API)
  const handleAddCollection = async () => {
    if (!newCollection.trim()) return;

    try {
      await api.post("/collection", {
        name: newCollection,
      });

      setNewCollection("");
      refreshCollections(); 
    } catch (err) {
      console.error(err);
    }
  };

  //  DELETE COLLECTION
  const handleDelete = async (id) => {
    try {
      await api.delete(`/collection/${id}`);
      refreshCollections();

      if (active === id) {
        setActive("LIBRARY");
        setActiveCollection(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // RENAME COLLECTION
  const handleRename = async (id, newName) => {
    if (!newName.trim()) return;

    try {
      await api.put(`/collection/${id}`, {
        name: newName,
      });

      refreshCollections();
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* SIDEBAR */}
      <div className="w-64 p-6 border-r border-white/10 bg-black/40 backdrop-blur-xl">

        {/* LOGO */}
        <h1
          onClick={() => {
            navigate("/");
            setActive("LIBRARY");
            setActiveCollection(null);
          }}
          className="text-xl font-bold text-cyan-400 mb-8 cursor-pointer"
        >
          Virtual Brain
        </h1>

        {/* NAV */}
        <div className="space-y-4 text-gray-300">

          <p
            onClick={() => {
              navigate("/");
              setActive("LIBRARY");
              setActiveCollection(null);
            }}
            className={`cursor-pointer ${
              active === "LIBRARY"
                ? "text-cyan-400"
                : "hover:text-cyan-400"
            }`}
          >
            📚 Library
          </p>

          <p
            onClick={() => navigate("/graph")}
            className="cursor-pointer hover:text-cyan-400"
          >
            🧠 Graph
          </p>
        </div>

        {/* COLLECTIONS */}
        <div className="mt-8">

          <h2 className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
            Collections
          </h2>

          {/* ➕ ADD */}
          <div className="flex gap-2 mb-3">
            <input
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              placeholder="New collection..."
              className="flex-1 px-2 py-1 text-xs bg-black/40 border border-white/10 rounded outline-none"
            />
            <button
              onClick={handleAddCollection}
              className="px-3 text-xs bg-cyan-500 text-black rounded"
            >
              +
            </button>
          </div>

          {/* ALL COLLECTIONS */}
          <div
            onClick={() => {
              setActive("ALL_COLLECTIONS");
              setActiveCollection("ALL_COLLECTIONS");
            }}
            className={`px-3 py-2 rounded-lg cursor-pointer text-sm mb-2
            ${
              active === "ALL_COLLECTIONS"
                ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                : "bg-white/5 hover:bg-cyan-500/10"
            }`}
          >
            📁 All Collections
          </div>

          {/* LIST */}
          <div className="space-y-2">
            {collections.map((col) => (
              <div
                key={col._id}
                className={`group px-3 py-2 rounded-lg flex justify-between items-center cursor-pointer text-sm
                ${
                  active === col._id
                    ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                    : "bg-white/5 hover:bg-cyan-500/10"
                }`}
              >
                {/* CLICK */}
                <div
                  onClick={() => {
                    setActiveCollection(col._id);
                    setActive(col._id);
                  }}
                  className="flex items-center gap-2 flex-1"
                >
                  <span>{col.icon || "📁"}</span>

                  {editingId === col._id ? (
                    <input
                      autoFocus
                      defaultValue={col.name}
                      onBlur={(e) =>
                        handleRename(col._id, e.target.value)
                      }
                      className="bg-transparent outline-none text-sm"
                    />
                  ) : (
                    col.name
                  )}
                </div>

                {/* ACTIONS */}
                <div className="hidden group-hover:flex gap-2 text-xs">
                  <button onClick={() => setEditingId(col._id)}>✏️</button>
                  <button onClick={() => handleDelete(col._id)}>❌</button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 relative">
        {children}
      </div>

    </div>
  );
}