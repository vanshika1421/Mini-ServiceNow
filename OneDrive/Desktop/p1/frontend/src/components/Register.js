import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import { Box, Typography, TextField, Button, Select, MenuItem, Alert } from '@mui/material';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password, role });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: '#fff' }}>
      <Typography variant="h4" align="center" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
        <Select value={role} onChange={e => setRole(e.target.value)} fullWidth sx={{ mt: 2 }}>
          <MenuItem value="employee">Employee</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Register</Button>
      </form>
      <Typography align="center" sx={{ mt: 2 }}>Already have an account? <Link to="/">Login</Link></Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}

export default Register;
