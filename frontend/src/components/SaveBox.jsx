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
  className="px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 
  hover:scale-105 active:scale-95 transition 
  shadow-lg shadow-cyan-500/30"
>
  Save
</button>

    </div>
  );
}