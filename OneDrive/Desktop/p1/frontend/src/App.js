import React from "react";
import { RoleProvider } from './contexts/RoleContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";

function App({ setMode, mode }) {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard setMode={setMode} mode={mode} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
