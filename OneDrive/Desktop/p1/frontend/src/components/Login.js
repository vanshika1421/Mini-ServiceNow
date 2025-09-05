import React, { useState } from "react";
import { useRole } from "../contexts/RoleContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { LockOutlined, EmailOutlined } from '@mui/icons-material';

function Login() {
  const { setUser } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `url('/welcome-bg.png') center/cover no-repeat, linear-gradient(120deg, #2563eb 0%, #38bdf8 100%)`,
      py: 6
    }}>
      <Box sx={{
        maxWidth: 400,
        width: '100%',
        bgcolor: '#fff',
        boxShadow: '0 8px 32px rgba(37,99,235,0.12)',
        borderRadius: 4,
        p: 4,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        position: 'relative',
        animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)'
      }}>
        <Box sx={{
          bgcolor: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
          color: '#fff',
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
          mb: 2
        }}>
          <LockOutlined sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h4" align="center" fontWeight={700} color="primary" gutterBottom>
          Welcome Back
        </Typography>
        <Typography align="center" sx={{ color: 'text.secondary', mb: 2 }}>
          Sign in to your ServiceNow Pro account
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: 'primary.main' }} />
                </InputAdornment>
              )
            }}
            sx={{
              bgcolor: '#f8fafc',
              borderRadius: 2,
              mb: 2
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'primary.main' }} />
                </InputAdornment>
              )
            }}
            sx={{
              bgcolor: '#f8fafc',
              borderRadius: 2,
              mb: 2
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
              boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
              transition: 'background 0.3s',
              '&:hover': {
                background: 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)'
              }
            }}
          >
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2, color: 'text.secondary' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
      </Box>
    </Box>
  );
}

export default Login;
