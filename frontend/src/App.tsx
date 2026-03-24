import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashbord";
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("@CTBicas:token");

  return token ? children : <Navigate to="/" />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
