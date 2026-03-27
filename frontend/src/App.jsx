import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GraphView from "./pages/GraphView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;