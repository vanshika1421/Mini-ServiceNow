import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Divider, 
  Stack, 
  Alert, 
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import {
  PersonOutlined,
  EmailOutlined,
  AdminPanelSettingsOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined
} from '@mui/icons-material';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:3011/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data);
        setMessage('');
      })
      .catch(() => {
        setMessage('Failed to load profile');
        setMessageType('error');
      });
  }, [token]);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('http://localhost:3011/api/auth/me', profile, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch {
      setMessage('Update failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async e => {
    e.preventDefault();
    if (!password.trim()) {
      setMessage('Please enter a new password');
      setMessageType('warning');
      return;
    }
    setLoading(true);
    try {
      await axios.put('http://localhost:3011/api/auth/password', { password }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Password changed successfully!');
      setMessageType('success');
      setPassword('');
    } catch {
      setMessage('Password change failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'error' : 'primary';
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminPanelSettingsOutlined /> : <PersonOutlined />;
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <PersonOutlined />
        </Avatar>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          User Profile
        </Typography>
      </Stack>
      
      <Divider sx={{ mb: 3 }} />

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleUpdate} sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
          Personal Information
        </Typography>
        
        <Stack spacing={3}>
          <TextField
            label="Full Name"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: <PersonOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />

          <TextField
            label="Email Address"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />

          <Box>
            <TextField
              label="Role"
              name="role"
              value={profile.role || ''}
              fullWidth
              disabled
              variant="outlined"
              InputProps={{
                startAdornment: getRoleIcon(profile.role),
                endAdornment: (
                  <Chip
                    label={profile.role || 'User'}
                    color={getRoleColor(profile.role)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <SaveOutlined /> : <EditOutlined />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handlePassword}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
          Security Settings
        </Typography>
        
        <Stack spacing={3}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter new password"
            InputProps={{
              startAdornment: <LockOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="outlined"
            size="large"
            disabled={loading || !password.trim()}
            startIcon={<LockOutlined />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default Profile;
