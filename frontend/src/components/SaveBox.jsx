import { useState } from "react";
import axios from "axios";

export default function SaveBox() {
  const [url, setUrl] = useState("");

  const handleSave = async () => {
    if (!url) return;

    await axios.post("http://localhost:5000/api/memory/save", {
      url,
    });

    setUrl("");
    alert("Saved !");
  };

  return (
    <div className="flex gap-3 mt-6">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste URL..."
        className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10"
      />

      <button
        onClick={handleSave}
        className="px-6 bg-cyan-500 rounded-xl hover:bg-cyan-400 transition"
      >
        Save
      </button>
    </div>
  );
}