import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx";
import GraphView from "./Pages/GraphView.jsx";
import Login3D from "./components/auth/Login3D.jsx"
import Register3D from "./components/auth/Register3D.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/login" element={<Login3D />} />
        <Route path="/register" element={<Register3D />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;