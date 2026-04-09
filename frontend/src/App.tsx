import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashbord";
import { Courts } from "./pages/Courts";
import { Schedule } from "./pages/Schedule";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Profile } from "./pages/Profile";

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
        <Route
          path="/courts"
          element={
            <PrivateRoute>
              <Courts />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/courts/:courtId"
          element={
            <PrivateRoute>
              <Schedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
