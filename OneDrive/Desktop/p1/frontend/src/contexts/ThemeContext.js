import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode colors - ServiceNow inspired
          primary: {
            main: '#0F4C75',
            light: '#3282B8',
            dark: '#0A3A5C',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#BBE1FA',
            light: '#E3F2FD',
            dark: '#90CAF9',
            contrastText: '#0F4C75',
          },
          background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#1A202C',
            secondary: '#4A5568',
          },
          divider: '#E2E8F0',
          action: {
            hover: '#F7FAFC',
            selected: '#EDF2F7',
          },
          success: {
            main: '#38A169',
            light: '#68D391',
            dark: '#2F855A',
          },
          warning: {
            main: '#D69E2E',
            light: '#F6E05E',
            dark: '#B7791F',
          },
          error: {
            main: '#E53E3E',
            light: '#FC8181',
            dark: '#C53030',
          },
          info: {
            main: '#3182CE',
            light: '#63B3ED',
            dark: '#2C5282',
          },
        }
      : {
          // Dark mode colors - ServiceNow inspired
          primary: {
            main: '#4A90E2',
            light: '#7BB3F0',
            dark: '#357ABD',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#2D3748',
            light: '#4A5568',
            dark: '#1A202C',
            contrastText: '#ffffff',
          },
          background: {
            default: '#0F1419',
            paper: '#1A202C',
          },
          text: {
            primary: '#F7FAFC',
            secondary: '#CBD5E0',
          },
          divider: '#2D3748',
          action: {
            hover: '#2D3748',
            selected: '#4A5568',
          },
          success: {
            main: '#48BB78',
            light: '#68D391',
            dark: '#38A169',
          },
          warning: {
            main: '#ED8936',
            light: '#F6AD55',
            dark: '#DD6B20',
          },
          error: {
            main: '#F56565',
            light: '#FC8181',
            dark: '#E53E3E',
          },
          info: {
            main: '#4299E1',
            light: '#63B3ED',
            dark: '#3182CE',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
            : '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #2D3748',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 1px 3px rgba(0,0,0,0.1)'
            : '0 2px 4px rgba(0,0,0,0.3)',
        },
      },
    },
  },
});

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('serviceNowTheme');
    return savedTheme || 'light';
  });

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('serviceNowTheme', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const contextValue = {
    mode,
    toggleColorMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
