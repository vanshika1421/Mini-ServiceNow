import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';
import { getTickets, updateTicket } from '../api';
import { getUsers } from '../api';

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const fetchTickets = async () => {
    const res = await getTickets(token);
    setTickets(res.data);
  };

  const fetchUsers = async () => {
    const res = await getUsers(token);
    setUsers(res.data);
  };

  const handleAssign = async (ticketId, userId) => {
    await updateTicket(ticketId, { assignedTo: userId }, token);
    fetchTickets();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Admin Dashboard</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Assign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.assignedTo?.name || 'Unassigned'}</TableCell>
                <TableCell>
                  <Select
                    value={ticket.assignedTo?._id || ''}
                    onChange={e => handleAssign(ticket._id, e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminDashboard;
