export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur">
      <h1 className="text-xl font-bold text-cyan-400">Second Brain</h1>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
}