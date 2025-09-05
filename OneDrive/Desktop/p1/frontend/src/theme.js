import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1A5A99',
      dark: '#17497C',
      light: '#3A7FC1',
    },
    secondary: {
      main: '#43B02A',
      dark: '#388E1F',
      light: '#66BB6A',
    },
    error: {
      main: '#E03C31',
      dark: '#B71C1C',
      light: '#FF6659',
    },
    background: {
      default: mode === 'light' ? '#F4F5F7' : '#181C24',
      paper: mode === 'light' ? '#FFFFFF' : '#23272F',
    },
    text: {
      primary: mode === 'light' ? '#1A1A1A' : '#F4F5F7',
      secondary: mode === 'light' ? '#5F6A7D' : '#B0B8C1',
    },
    divider: mode === 'light' ? '#E0E3E7' : '#23272F',
    action: {
      hover: mode === 'light' ? 'rgba(26, 90, 153, 0.08)' : 'rgba(67, 176, 42, 0.12)',
      selected: mode === 'light' ? 'rgba(67, 176, 42, 0.12)' : 'rgba(26, 90, 153, 0.16)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#F4F5F7' : '#181C24',
          color: mode === 'light' ? '#1A1A1A' : '#F4F5F7',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: mode === 'light' ? '#cbd5e1 #f1f5f9' : '#475569 #1e293b',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: mode === 'light' ? '#f1f5f9' : '#1e293b',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: mode === 'light' ? '#cbd5e1' : '#475569',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: mode === 'light' ? '#94a3b8' : '#64748b',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: mode === 'light' ? '1px solid #E0E3E7' : '1px solid #23272F',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#23272F',
          boxShadow: mode === 'light' 
            ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              : '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: mode === 'light' 
            ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
        },
        contained: {
          boxShadow: mode === 'light'
            ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
            : '0 2px 4px 0 rgb(0 0 0 / 0.2)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 2px 4px 0 rgb(0 0 0 / 0.1)'
              : '0 4px 8px 0 rgb(0 0 0 / 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            '& fieldset': {
              borderColor: mode === 'light' ? '#e2e8f0' : '#475569',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#cbd5e1' : '#64748b',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
            },
          },
        },
      },
    },
  },
});
