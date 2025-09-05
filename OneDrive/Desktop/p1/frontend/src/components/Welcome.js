import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Avatar } from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: `url('/welcome-bg.png') center/cover no-repeat, linear-gradient(120deg, #2563eb 0%, #38bdf8 100%)`,
      py: 6,
    }}>
      <Box sx={{
        maxWidth: 480,
        width: '100%',
        bgcolor: '#fff',
        boxShadow: '0 8px 32px rgba(37,99,235,0.18)',
        borderRadius: 4,
        p: 5,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        border: '1.5px solid rgba(56,189,248,0.18)',
        animation: 'fadeInUp 1.2s cubic-bezier(.4,0,.2,1)'
      }}>
        <Box sx={{
          bgcolor: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
          color: '#fff',
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
          mb: 3,
          animation: 'iconBounce 2.5s infinite',
          border: '3px solid #fff',
        }}>
          <DashboardIcon sx={{ fontSize: 48 }} />
        </Box>
        {/* Animated floating shapes */}
        <Box sx={{
          position: 'absolute',
          top: -30,
          left: 30,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38bdf8 60%, #2563eb 100%)',
          opacity: 0.18,
          animation: 'floatShape1 6s ease-in-out infinite',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -24,
          right: 40,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb 60%, #38bdf8 100%)',
          opacity: 0.15,
          animation: 'floatShape2 7s ease-in-out infinite',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          top: 60,
          right: -18,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38bdf8 60%, #2563eb 100%)',
          opacity: 0.12,
          animation: 'floatShape3 5s ease-in-out infinite',
          zIndex: 0
        }} />
        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom sx={{ mb: 2, textShadow: '0 2px 8px rgba(37,99,235,0.10)' }}>
          Welcome to ServiceNow Pro
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}>
          Your modern IT Service Management platform for employees and admins.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
            boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
            transition: 'background 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)'
            }
          }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Box>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes welcomeBgMove {
          0% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1.05) rotate(2deg); }
        }
        @keyframes floatShape1 {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes floatShape2 {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(14px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes floatShape3 {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.12); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </Box>
  );
};

export default Welcome;
