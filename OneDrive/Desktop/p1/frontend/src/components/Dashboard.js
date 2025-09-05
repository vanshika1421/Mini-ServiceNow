import React, { useEffect, useState } from "react";
import { useRole } from '../contexts/RoleContext';
import { useNavigate } from "react-router-dom";
import { getTickets } from "../api";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import TicketComments from "./TicketComments";
import Profile from "./Profile";
import NotificationCenter from "./NotificationCenter";
import LiveActivityFeed from "./LiveActivityFeed";
import KnowledgeBase from "./KnowledgeBase";
import Analytics from "./Analytics";  
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  AppBar,
  Toolbar,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Switch,
  Paper,
  Chip,
  Badge,
  LinearProgress,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Select,
  Snackbar
} from '@mui/material';
import {
  blue,
  green,
  orange,
  red,
  grey,
  deepPurple
} from '@mui/material/colors';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Warning as WarningIcon,
  LibraryBooks as LibraryBooksIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

function Dashboard({ setMode, mode }) {
  // Restore token variable for API calls and NotificationCenter
  const token = localStorage.getItem('token');
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState({ avgResolution: null, topIssues: [] });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useRole();
  const userRole = user?.role || 'employee';

  useEffect(() => {
    if (!token) navigate("/");
    fetchTickets();
    fetchAnalytics();
  }, []);

  const fetchTickets = async () => {
    const res = await getTickets(token);
    setTickets(res.data);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:3011/api/tickets/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(await res.json());
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  const handleTicketCreated = async (ticket) => {
    await fetchTickets();
    fetchAnalytics();
    setSnackbar({ open: true, message: 'Ticket created successfully!' });
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prev => prev.map(ticket => 
      ticket._id === updatedTicket._id ? updatedTicket : ticket
    ));
    fetchAnalytics();
    setSnackbar({ open: true, message: 'Ticket updated successfully!' });
  };

  const handleSelectTicket = (id) => {
    setSelectedTicketId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setSnackbar({ open: true, message: 'Logged out!' });
  };

  const handleThemeToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
    setSnackbar({ open: true, message: `Switched to ${mode === 'light' ? 'dark' : 'light'} mode` });
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Filter tickets for employee to only their own
  const filteredTickets = userRole === 'admin'
    ? tickets
    : tickets.filter(t => t.createdBy?._id === user?._id);

  const chartData = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Tickets",
        data: [
          filteredTickets.filter(t => t.status === "Open").length,
          filteredTickets.filter(t => t.status === "In Progress").length,
          filteredTickets.filter(t => t.status === "Resolved").length,
          filteredTickets.filter(t => t.status === "Closed").length
        ],
        backgroundColor: ["#f39c12","#3498db","#2ecc71","#95a5a6"]
      }
    ]
  };

  // Sidebar navigation items
  const drawerWidth = sidebarOpen ? 220 : 60;
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, color: blue[500] },
    { text: 'Tickets', icon: <AssignmentIcon />, color: green[500] },
    ...(userRole === 'admin' ? [
      { text: 'Analytics', icon: <BarChartIcon />, color: orange[500] },
      { text: 'SLA Management', icon: <SpeedIcon />, color: red[500] }
    ] : []),
    { text: 'Knowledge Base', icon: <LibraryBooksIcon />, color: deepPurple[500] }
  ];

  // Sidebar navigation logic
  const [selectedView, setSelectedView] = useState('Dashboard');
  const { role } = useRole();
  const handleNavClick = (text) => {
    setSelectedView(text);
  };

  // Calculate dashboard stats
  const dashboardStats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'Open').length,
    inProgressTickets: tickets.filter(t => t.status === 'In Progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'Resolved').length,
    slaBreached: tickets.filter(t => t.slaBreached).length
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        zIndex: 1201, 
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleSidebarToggle} sx={{ mr: 2, '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <Avatar sx={{ 
                mr: 2, 
                bgcolor: 'linear-gradient(45deg, #667eea, #764ba2)', 
                width: 45, 
                height: 45,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}>SN</Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>ServiceNow Pro</Typography>
                <Typography variant="caption" color="text.secondary">IT Service Management</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationCenter userId={JSON.parse(atob(token.split('.')[1])).id} />
            <IconButton color="inherit" onClick={handleThemeToggle} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <Avatar sx={{ 
              bgcolor: 'linear-gradient(45deg, #667eea, #764ba2)', 
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }} onClick={handleAvatarClick}>V</Avatar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAvatarClose}>
              <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
              {userRole === 'admin' && (
                <MenuItem onClick={() => navigate('/admin')}>Admin Panel</MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: 'background.paper', 
            backdropFilter: 'blur(20px)',
            borderRight: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
            transition: 'width 0.3s ease-in-out' 
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2, px: 1 }}>
          <List>
            {navItems.map((item, idx) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => handleNavClick(item.text)} 
                selected={selectedView === item.text} 
                sx={{ 
                  borderRadius: 3, 
                  mb: 1, 
                  mx: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: `linear-gradient(45deg, ${item.color}15, ${item.color}25)`,
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }, 
                  justifyContent: sidebarOpen ? 'flex-start' : 'center', 
                  background: selectedView === item.text ? `linear-gradient(45deg, ${item.color}20, ${item.color}30)` : 'transparent',
                  boxShadow: selectedView === item.text ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <ListItemIcon sx={{ 
                  color: selectedView === item.text ? item.color : grey[600], 
                  minWidth: 0, 
                  mr: sidebarOpen ? 2 : 0,
                  transition: 'color 0.3s ease'
                }}>{item.icon}</ListItemIcon>
                {sidebarOpen && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: selectedView === item.text ? 700 : 500,
                      color: selectedView === item.text ? item.color : grey[700]
                    }} 
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: `${drawerWidth}px`, transition: 'margin-left 0.3s ease-in-out', bgcolor: 'background.default' }}>
        <Toolbar />
        {selectedView === 'Dashboard' && (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main', letterSpacing: 1 }}>Dashboard Overview</Typography>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', borderRadius: 4, boxShadow: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <AssignmentIcon sx={{ fontSize: 48, opacity: 0.8, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{filteredTickets.length}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Tickets</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)', color: 'white', borderRadius: 4, boxShadow: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <WarningIcon sx={{ fontSize: 48, opacity: 0.8, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{filteredTickets.filter(t => t.priority === 'High').length}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>High Priority</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ background: 'linear-gradient(45deg, #4facfe, #00f2fe)', color: 'white', borderRadius: 4, boxShadow: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{analytics.avgResolution || 'N/A'}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Avg Resolution</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ background: 'linear-gradient(45deg, #43e97b, #38f9d7)', color: 'white', borderRadius: 4, boxShadow: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <AssignmentTurnedInIcon sx={{ fontSize: 48, opacity: 0.8, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{filteredTickets.filter(t => t.status === 'Resolved').length}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Resolved</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Profile & Ticket Creation</Typography>
                <Card sx={{ mb: 3, borderRadius: 4, bgcolor: 'background.paper', boxShadow: 2 }}>
                  <CardContent>
                    <Profile />
                  </CardContent>
                </Card>
                <Card sx={{ mb: 3, borderRadius: 4, bgcolor: 'background.paper', boxShadow: 2 }}>
                  <CardContent>
                    <TicketForm onTicketCreated={handleTicketCreated} />
                  </CardContent>
                </Card>
                <LiveActivityFeed maxItems={15} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Tickets & Comments</Typography>
                <Card sx={{ mb: 3, borderRadius: 4, bgcolor: 'background.paper', boxShadow: 2 }}>
                  <CardContent>
                    <TicketList tickets={filteredTickets} onTicketUpdate={handleTicketUpdate} />
                  </CardContent>
                </Card>
                <Card sx={{ mb: 3, borderRadius: 4, bgcolor: 'background.paper', boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Ticket Comments</Typography>
                    <Select
                      value={selectedTicketId || ''}
                      onChange={e => handleSelectTicket(e.target.value)}
                      displayEmpty
                      sx={{ minWidth: 200, mb: 2, borderRadius: 2 }}
                    >
                      <MenuItem value=""><em>-- Select Ticket --</em></MenuItem>
                      {tickets.map(t => (
                        <MenuItem key={t._id} value={t._id}>{t.title}</MenuItem>
                      ))}
                    </Select>
                    {selectedTicketId && <TicketComments ticketId={selectedTicketId} />}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        {selectedView === 'Tickets' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ 
                  mb: 3, 
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>Ticket Management</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <TicketList tickets={filteredTickets} onTicketUpdate={handleTicketUpdate} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        )}
  {userRole === 'admin' && selectedView === 'Analytics' && (
          <Grid container spacing={3} alignItems="stretch" justifyContent="center" sx={{ height: 'calc(100vh - 100px)' }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                p: 4,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }
              }}>
                <CardContent sx={{ width: '100%', height: '100%' }}>
                  <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: 'text.primary' }}>Ticket Status Overview</Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ width: '100%', height: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map((status, index) => {
                        const count = tickets.filter(t => t.status === status).length;
                        const percentage = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                        const colors = ['#F57C00', '#1976D2', '#388E3C', '#9E9E9E'];
                        return (
                          <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>{status}</Typography>
                            <Box sx={{ flex: 1, bgcolor: 'grey.200', borderRadius: 1, height: 24, position: 'relative' }}>
                              <Box sx={{ bgcolor: colors[index], height: '100%', borderRadius: 1, width: `${percentage}%`, transition: 'width 0.5s ease' }} />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right', fontWeight: 600 }}>{count}</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                p: 4,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }
              }}>
                <CardContent sx={{ width: '100%' }}>
                  <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: 'text.primary' }}>Analytics</Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 18, mb: 3, p: 2, borderRadius: 2, background: 'linear-gradient(45deg, #667eea15, #764ba215)' }}>
                      <strong>Average Resolution Time:</strong><br/>
                      {analytics.avgResolution ? analytics.avgResolution.toFixed(2) + ' hours' : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: 18, p: 2, borderRadius: 2, background: 'linear-gradient(45deg, #f093fb15, #f5576c15)' }}>
                      <strong>Top Issues:</strong><br/>
                      {analytics.topIssues.join(', ') || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Knowledge Base View */}
        {selectedView === 'Knowledge Base' && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ 
                  mb: 3, 
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 8 }}>
                    <LibraryBooksIcon sx={{ fontSize: 80, color: deepPurple[500], mb: 2 }} />
                    <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>Knowledge Base</Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: grey[600] }}>Self-service articles and solutions coming soon!</Typography>
                    <Button 
                      variant="contained" 
                      size="large"
                      sx={{ 
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      Browse Articles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <KnowledgeBase />
          </>
        )}
        {/* SLA Management View */}
  {userRole === 'admin' && selectedView === 'SLA Management' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ 
                mb: 3, 
                borderRadius: 4,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }
              }}>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <SpeedIcon sx={{ fontSize: 80, color: red[500], mb: 2 }} />
                  <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>SLA Management</Typography>
                  <Typography variant="h6" sx={{ mb: 4, color: grey[600] }}>Service Level Agreement monitoring and breach alerts</Typography>
                  {dashboardStats.slaBreached > 0 && (
                    <Chip 
                      icon={<WarningIcon />} 
                      label={`${dashboardStats.slaBreached} SLA Breaches`} 
                      color="error" 
                      size="large"
                      sx={{ mb: 3, fontSize: 16, py: 3 }}
                    />
                  )}
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)'
                    }}
                  >
                    View SLA Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Box>
  );
}

export default Dashboard;
