import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  Fade,
  Grow
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { green, orange, red, blue, grey } from '@mui/material/colors';
import { getTickets, updateTicket } from '../api';
import TicketEditModal from './TicketEditModal';
import socketService from '../services/socketService';

function TicketList({ tickets, onTicketUpdate }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [localTickets, setLocalTickets] = useState(tickets);

  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  useEffect(() => {
    // Listen for real-time ticket updates
    const handleTicketListUpdate = (update) => {
      const { action, ticket } = update;
      
      setLocalTickets(prevTickets => {
        switch (action) {
          case 'create':
            return [ticket, ...prevTickets];
          case 'update':
            return prevTickets.map(t => t._id === ticket._id ? ticket : t);
          case 'delete':
            return prevTickets.filter(t => t._id !== ticket._id);
          default:
            return prevTickets;
        }
      });
    };

    socketService.on('ticket_list_update', handleTicketListUpdate);

    return () => {
      socketService.off('ticket_list_update', handleTicketListUpdate);
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedTicket(null);
  };

  const handleTicketSave = (updatedTicket) => {
    if (onTicketUpdate) {
      onTicketUpdate(updatedTicket);
    }
  };

  const filteredTickets = localTickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTickets = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return red[500];
      case 'High': return orange[500];
      case 'Medium': return blue[500];
      case 'Low': return green[500];
      default: return grey[500];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return red[100];
      case 'In Progress': return blue[100];
      case 'Resolved': return green[100];
      case 'Closed': return grey[100];
      default: return grey[100];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <WarningIcon sx={{ fontSize: 16 }} />;
      case 'In Progress': return <ScheduleIcon sx={{ fontSize: 16 }} />;
      case 'Resolved': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'Closed': return <AssignmentIcon sx={{ fontSize: 16 }} />;
      default: return <AssignmentIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Fade in timeout={600}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Ticket Management
          </Typography>
          <TextField
            placeholder="Search tickets..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 4,
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Ticket</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTickets.map((ticket, index) => (
                <Grow in timeout={300 + index * 100} key={ticket._id}>
                  <TableRow 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 2, 
                            bgcolor: getPriorityColor(ticket.priority),
                            fontSize: 14
                          }}
                        >
                          {ticket.title.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{ticket._id.slice(-6)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority}
                        size="small"
                        sx={{
                          bgcolor: `${getPriorityColor(ticket.priority)}20`,
                          color: getPriorityColor(ticket.priority),
                          fontWeight: 600,
                          borderRadius: 2
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(ticket.status)}
                        label={ticket.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(ticket.status),
                          fontWeight: 600,
                          borderRadius: 2
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {ticket.assignedTo ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              mr: 1, 
                              bgcolor: blue[500],
                              fontSize: 12
                            }}
                          >
                            {ticket.assignedTo.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">
                            {ticket.assignedTo.name}
                          </Typography>
                        </Box>
                      ) : (
                        <Chip 
                          label="Unassigned" 
                          size="small" 
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: blue[500],
                              '&:hover': { bgcolor: blue[50] }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Ticket">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditClick(ticket)}
                            sx={{ 
                              color: orange[500],
                              '&:hover': { bgcolor: orange[50] }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                </Grow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredTickets.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ 
            mt: 2,
            bgcolor: 'background.paper',
            borderRadius: 3,
            color: 'text.primary'
          }}
        />
        <TicketEditModal
          open={editModalOpen}
          onClose={handleEditClose}
          ticket={selectedTicket}
          onSave={handleTicketSave}
        />
      </Box>
    </Fade>
  );
}

export default TicketList;
