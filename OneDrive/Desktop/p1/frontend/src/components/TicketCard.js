import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Button
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const TicketCard = ({ ticket, onTicketClick, onStatusChange, userRole }) => {
  const theme = useTheme();

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#D32F2F';
      case 'high': return '#F57C00';
      case 'medium': return '#1976D2';
      case 'low': return '#388E3C';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#F57C00';
      case 'in progress': return '#1976D2';
      case 'resolved': return '#388E3C';
      case 'closed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return <ScheduleIcon />;
      case 'in progress': return <AccessTimeIcon />;
      case 'resolved': return <CheckCircleIcon />;
      case 'closed': return <CheckCircleIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const calculateSLAProgress = () => {
    if (!ticket.resolutionDeadline) return 0;
    
    const now = new Date();
    const created = new Date(ticket.createdAt);
    const deadline = new Date(ticket.resolutionDeadline);
    
    const totalTime = deadline.getTime() - created.getTime();
    const elapsedTime = now.getTime() - created.getTime();
    
    return Math.min((elapsedTime / totalTime) * 100, 100);
  };

  const getSLAStatus = () => {
    const progress = calculateSLAProgress();
    if (progress >= 100) return 'breached';
    if (progress >= 80) return 'warning';
    return 'good';
  };

  const getSLAColor = () => {
    const status = getSLAStatus();
    switch (status) {
      case 'breached': return '#D32F2F';
      case 'warning': return '#F57C00';
      default: return '#388E3C';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const slaProgress = calculateSLAProgress();
  const slaStatus = getSLAStatus();

  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.main
        },
        ...(slaStatus === 'breached' && {
          borderLeft: `4px solid ${getSLAColor()}`,
          bgcolor: alpha('#D32F2F', 0.05)
        })
      }}
      onClick={() => onTicketClick(ticket)}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              #{ticket._id?.slice(-6)} - {ticket.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {ticket.description?.substring(0, 100)}...
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <Chip
              label={ticket.priority}
              size="small"
              sx={{
                bgcolor: getPriorityColor(ticket.priority),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
            <Chip
              icon={getStatusIcon(ticket.status)}
              label={ticket.status}
              size="small"
              variant="outlined"
              sx={{
                borderColor: getStatusColor(ticket.status),
                color: getStatusColor(ticket.status),
                '& .MuiChip-icon': {
                  color: getStatusColor(ticket.status)
                }
              }}
            />
          </Box>
        </Box>

        {/* SLA Progress */}
        {ticket.resolutionDeadline && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                SLA Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {slaStatus === 'breached' && <WarningIcon sx={{ fontSize: 16, color: getSLAColor() }} />}
                <Typography variant="caption" sx={{ color: getSLAColor(), fontWeight: 600 }}>
                  {slaStatus === 'breached' ? 'BREACHED' : 
                   slaStatus === 'warning' ? 'AT RISK' : 'ON TRACK'}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={slaProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getSLAColor(),
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}

        {/* Metadata */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {ticket.assignedTo?.name || 'Unassigned'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {ticket.comments?.length || 0}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatTimeAgo(ticket.createdAt)}
          </Typography>
        </Box>

        {/* Category and Impact */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={ticket.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          <Chip
            label={`Impact: ${ticket.impact}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          <Chip
            label={`Urgency: ${ticket.urgency}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      </CardContent>

      {/* Actions */}
      {userRole === 'admin' && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            {ticket.status === 'Open' && (
              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(ticket._id, 'In Progress');
                }}
              >
                Start Work
              </Button>
            )}
            {ticket.status === 'In Progress' && (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(ticket._id, 'Resolved');
                }}
              >
                Resolve
              </Button>
            )}
            {ticket.status === 'Resolved' && (
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(ticket._id, 'Closed');
                }}
              >
                Close
              </Button>
            )}
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default TicketCard;
