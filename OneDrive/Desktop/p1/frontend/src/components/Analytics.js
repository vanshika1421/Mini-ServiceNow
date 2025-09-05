import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const Analytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});

  // Sample analytics data - replace with API calls
  const sampleData = {
    overview: {
      totalTickets: 1247,
      openTickets: 89,
      resolvedTickets: 1158,
      avgResolutionTime: 4.2,
      slaBreaches: 23,
      customerSatisfaction: 4.6
    },
    trends: [
      { date: '2024-01-01', created: 45, resolved: 42, breaches: 2 },
      { date: '2024-01-02', created: 52, resolved: 48, breaches: 1 },
      { date: '2024-01-03', created: 38, resolved: 45, breaches: 3 },
      { date: '2024-01-04', created: 61, resolved: 55, breaches: 2 },
      { date: '2024-01-05', created: 43, resolved: 58, breaches: 1 },
      { date: '2024-01-06', created: 39, resolved: 41, breaches: 0 },
      { date: '2024-01-07', created: 47, resolved: 44, breaches: 2 }
    ],
    categoryBreakdown: [
      { name: 'Hardware', value: 35, color: '#FF6B6B' },
      { name: 'Software', value: 28, color: '#4ECDC4' },
      { name: 'Network', value: 20, color: '#45B7D1' },
      { name: 'Access', value: 12, color: '#96CEB4' },
      { name: 'Other', value: 5, color: '#FFEAA7' }
    ],
    priorityDistribution: [
      { priority: 'Critical', count: 15, percentage: 12 },
      { priority: 'High', count: 45, percentage: 36 },
      { priority: 'Medium', count: 52, percentage: 42 },
      { priority: 'Low', count: 12, percentage: 10 }
    ],
    resolutionTimes: [
      { category: 'Hardware', avgTime: 6.2, target: 8.0 },
      { category: 'Software', avgTime: 3.8, target: 4.0 },
      { category: 'Network', avgTime: 5.1, target: 6.0 },
      { category: 'Access', avgTime: 2.3, target: 2.0 },
      { category: 'Other', avgTime: 4.5, target: 4.0 }
    ],
    topPerformers: [
      { name: 'Sarah Johnson', resolved: 87, avgTime: 3.2, satisfaction: 4.8 },
      { name: 'Mike Chen', resolved: 76, avgTime: 3.8, satisfaction: 4.6 },
      { name: 'Emily Davis', resolved: 69, avgTime: 4.1, satisfaction: 4.7 },
      { name: 'Alex Rodriguez', resolved: 62, avgTime: 3.9, satisfaction: 4.5 }
    ]
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(sampleData);
      setLoading(false);
    }, 1000);
  };

  const MetricCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />
              )}
              <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {value}
        </Typography>
        <Typography variant="h6" color="text.primary" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#F44336';
      case 'High': return '#FF9800';
      case 'Medium': return '#2196F3';
      case 'Low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <LinearProgress />
                  <Box sx={{ mt: 2, height: 100 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#1976D2' }}>
            ServiceNow Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into your IT service management performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadAnalytics} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Total Tickets"
            value={analyticsData.overview?.totalTickets?.toLocaleString()}
            subtitle="All time"
            icon={<AssignmentIcon />}
            trend={8.2}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Open Tickets"
            value={analyticsData.overview?.openTickets}
            subtitle="Currently active"
            icon={<ScheduleIcon />}
            trend={-5.1}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Resolved"
            value={analyticsData.overview?.resolvedTickets?.toLocaleString()}
            subtitle="Successfully closed"
            icon={<CheckCircleIcon />}
            trend={12.3}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Avg Resolution"
            value={`${analyticsData.overview?.avgResolutionTime}h`}
            subtitle="Time to resolve"
            icon={<SpeedIcon />}
            trend={-8.7}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="SLA Breaches"
            value={analyticsData.overview?.slaBreaches}
            subtitle="This month"
            icon={<WarningIcon />}
            trend={-15.2}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Satisfaction"
            value={`${analyticsData.overview?.customerSatisfaction}/5`}
            subtitle="Customer rating"
            icon={<PeopleIcon />}
            trend={3.1}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Ticket Trends */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Ticket Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stackId="1"
                    stroke="#1976D2"
                    fill="#1976D2"
                    fillOpacity={0.6}
                    name="Created"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="2"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    fillOpacity={0.6}
                    name="Resolved"
                  />
                  <Line
                    type="monotone"
                    dataKey="breaches"
                    stroke="#F44336"
                    strokeWidth={3}
                    name="SLA Breaches"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Category Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.categoryBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Priority Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {analyticsData.priorityDistribution?.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={item.priority}
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(item.priority),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Typography variant="body2">{item.count} tickets</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {item.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getPriorityColor(item.priority),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Resolution Times by Category */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Resolution Times vs Targets
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.resolutionTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="avgTime" fill="#1976D2" name="Actual Time (hrs)" />
                  <Bar dataKey="target" fill="#FF9800" name="Target Time (hrs)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Performers */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Performing Agents
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {analyticsData.topPerformers?.map((performer, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : '#CD7F32'
                          }}
                        >
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {performer.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Resolved:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {performer.resolved}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Avg Time:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {performer.avgTime}h
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Rating:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {performer.satisfaction}/5
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
