import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SLATimer = ({ ticket, variant = 'linear', size = 'medium' }) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (!ticket.resolutionDeadline) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">
          No SLA defined
        </Typography>
      </Box>
    );
  }

  const calculateSLAMetrics = () => {
    const now = currentTime;
    const created = new Date(ticket.createdAt);
    const deadline = new Date(ticket.resolutionDeadline);
    const resolved = ticket.resolvedAt ? new Date(ticket.resolvedAt) : null;

    const totalTime = deadline.getTime() - created.getTime();
    const elapsedTime = (resolved || now).getTime() - created.getTime();
    const remainingTime = deadline.getTime() - now.getTime();
    
    const progress = Math.min((elapsedTime / totalTime) * 100, 100);
    const isBreached = remainingTime < 0 && !resolved;
    const isResolved = !!resolved;
    const isAtRisk = remainingTime < (totalTime * 0.2) && !resolved; // Less than 20% time remaining

    return {
      progress,
      remainingTime,
      isBreached,
      isResolved,
      isAtRisk,
      totalTime
    };
  };

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.abs(Math.floor(milliseconds / (1000 * 60)));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getSLAStatus = () => {
    const { isBreached, isResolved, isAtRisk } = calculateSLAMetrics();
    
    if (isResolved) return 'resolved';
    if (isBreached) return 'breached';
    if (isAtRisk) return 'at-risk';
    return 'on-track';
  };

  const getSLAColor = () => {
    const status = getSLAStatus();
    switch (status) {
      case 'resolved': return theme.palette.success.main;
      case 'breached': return theme.palette.error.main;
      case 'at-risk': return theme.palette.warning.main;
      default: return theme.palette.success.main;
    }
  };

  const getSLAIcon = () => {
    const status = getSLAStatus();
    const iconProps = { fontSize: size === 'small' ? 14 : 16, color: getSLAColor() };
    
    switch (status) {
      case 'resolved': return <CheckCircleIcon sx={iconProps} />;
      case 'breached': return <ErrorIcon sx={iconProps} />;
      case 'at-risk': return <WarningIcon sx={iconProps} />;
      default: return <ScheduleIcon sx={iconProps} />;
    }
  };

  const getSLALabel = () => {
    const status = getSLAStatus();
    switch (status) {
      case 'resolved': return 'RESOLVED';
      case 'breached': return 'BREACHED';
      case 'at-risk': return 'AT RISK';
      default: return 'ON TRACK';
    }
  };

  const { progress, remainingTime, isBreached, isResolved } = calculateSLAMetrics();

  if (variant === 'circular') {
    return (
      <Tooltip title={`SLA: ${getSLALabel()} - ${isResolved ? 'Resolved' : isBreached ? `Overdue by ${formatTime(Math.abs(remainingTime))}` : `${formatTime(remainingTime)} remaining`}`}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            size={size === 'small' ? 24 : size === 'large' ? 48 : 32}
            thickness={4}
            sx={{
              color: getSLAColor(),
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getSLAIcon()}
          </Box>
        </Box>
      </Tooltip>
    );
  }

  if (variant === 'chip') {
    return (
      <Chip
        icon={getSLAIcon()}
        label={getSLALabel()}
        size={size}
        sx={{
          bgcolor: `${getSLAColor()}15`,
          color: getSLAColor(),
          border: `1px solid ${getSLAColor()}30`,
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: getSLAColor()
          }
        }}
      />
    );
  }

  // Default linear variant
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {getSLAIcon()}
          <Typography 
            variant={size === 'small' ? 'caption' : 'body2'} 
            sx={{ color: getSLAColor(), fontWeight: 600 }}
          >
            SLA: {getSLALabel()}
          </Typography>
        </Box>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {isResolved 
            ? 'Resolved' 
            : isBreached 
              ? `Overdue by ${formatTime(Math.abs(remainingTime))}`
              : `${formatTime(remainingTime)} remaining`
          }
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(progress, 100)}
        sx={{
          height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
          borderRadius: 3,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            bgcolor: getSLAColor(),
            borderRadius: 3
          }
        }}
      />
    </Box>
  );
};

export default SLATimer;
