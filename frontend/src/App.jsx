import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx"
import GraphView from "./Pages/GraphView.jsx";
import Login3D from "./components/auth/Login3D.jsx";
import Register3D from "./components/auth/Register3D.jsx";

function App() {
  const token = localStorage.getItem("token");

  // Strong auth check
  const isLoggedIn =
    !!token && token !== "undefined" && token !== "null";

  return (
    <BrowserRouter>
      <Routes>

        {/*  DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/*  AUTH ROUTES (BLOCK if already logged in) */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Login3D />
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Register3D />
          }
        />

        {/*  PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/graph"
          element={
            isLoggedIn
              ? <GraphView />
              : <Navigate to="/login" replace />
          }
        />

        {/* FALLBACK (UNKNOWN ROUTES) */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;