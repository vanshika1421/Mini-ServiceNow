import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { getTickets } from '../api';

function TicketComments({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data.comments || []);
    } catch (err) {
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;
    await axios.post(`http://localhost:5000/api/tickets/${ticketId}/comments`, { text }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setText('');
    fetchComments();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Comments</Typography>
      <List>
        {comments.map((c, i) => (
          <ListItem key={i}>
            <ListItemText primary={c.text} secondary={new Date(c.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
      <TextField label="Add Comment" value={text} onChange={e => setText(e.target.value)} fullWidth sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddComment}>Add</Button>
    </Box>
  );
}

export default TicketComments;
