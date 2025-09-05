import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Chip,
  Divider,
  Fade,
  IconButton
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import socketService from '../services/socketService';

const getActivityColor = (type) => {
  switch (type) {
    case 'create':
    case 'ticket_created':
      return '#1976D2'; // blue
    case 'update':
    case 'ticket_updated':
    case 'ticket_status_changed':
      return '#0288D1'; // light blue
    case 'ticket_assigned':
      return '#388E3C'; // green
    case 'comment_added':
      return '#7B1FA2'; // purple
    default:
      return '#757575'; // grey
  }
};

const LiveActivityFeed = ({ maxItems = 10 }) => {
  const theme = useTheme();
  const [activities, setActivities] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    // Listen for real-time updates
    const handleTicketUpdate = (update) => {
      const { action, ticket } = update;
      const activity = {
        id: Date.now(),
        type: action,
        ticket,
        timestamp: new Date(),
        message: getActivityMessage(action, ticket)
      };

      setActivities(prev => [activity, ...prev.slice(0, maxItems - 1)]);
    };

    const handleNotification = (notification) => {
      const activity = {
        id: notification.id,
        type: notification.type,
        data: notification.data,
        timestamp: notification.timestamp,
        message: notification.message,
        title: notification.title
      };

      setActivities(prev => [activity, ...prev.slice(0, maxItems - 1)]);
    };

    socketService.on('ticket_list_update', handleTicketUpdate);
    socketService.on('notification', handleNotification);

    return () => {
      socketService.off('ticket_list_update', handleTicketUpdate);
      socketService.off('notification', handleNotification);
    };
  }, [maxItems]);

  const getActivityMessage = (action, ticket) => {
    switch (action) {
      case 'create':
        return `New ticket "${ticket.title}" created with ${ticket.priority} priority`;
      case 'update':
        return `Ticket "${ticket.title}" was updated`;
      case 'delete':
        return `Ticket "${ticket.title}" was deleted`;
      default:
        return `Ticket "${ticket.title}" had an activity`;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
      case 'ticket_created':
        return <TicketIcon color="primary" />;
      case 'update':
      case 'ticket_updated':
      case 'ticket_status_changed':
        return <UpdateIcon color="info" />;
      case 'ticket_assigned':
        return <AssignmentIcon color="success" />;
      case 'comment_added':
        return <CommentIcon color="secondary" />;
      default:
        return <ScheduleIcon color="action" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ 
      maxHeight: 320,
      minHeight: 220,
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      boxShadow: theme.shadows[2],
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 1, flex: 1, overflowY: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
            Live Activity Feed
          </Typography>
          <IconButton
            onClick={handleExpandClick}
            size="small"
            sx={{ 
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {expanded && (
          <Box sx={{ mt: 1, maxHeight: 220, overflowY: 'auto' }}>
            {activities.length === 0 ? (
              <Box textAlign="center" py={3}>
                <ScheduleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {activities.map((activity, index) => (
                  <Fade key={activity.id} in timeout={300 + index * 100}>
                    <Box>
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Avatar sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: getActivityColor(activity.type),
                            fontSize: '0.7rem'
                          }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25, fontSize: '0.95rem' }}>
                              {activity.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.8rem' }}>
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                {formatTime(activity.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < activities.length - 1 && <Divider />}
                    </Box>
                  </Fade>
                ))}
              </List>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
