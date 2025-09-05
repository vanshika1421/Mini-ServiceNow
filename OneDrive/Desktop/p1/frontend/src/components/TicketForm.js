import React, { useState } from "react";
import { createTicket } from "../api";
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Typography, 
  Paper,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { 
  CreateOutlined, 
  PriorityHighOutlined, 
  DescriptionOutlined, 
  TitleOutlined 
} from '@mui/icons-material';

function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ticketData = { title, description, priority };
      const res = await createTicket(ticketData, token);
      onTicketCreated(res.data);
      setTitle(""); 
      setDescription(""); 
      setPriority("Low");
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <CreateOutlined color="primary" />
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Create New Ticket
        </Typography>
      </Stack>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Ticket Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          variant="outlined"
          InputProps={{
            startAdornment: <TitleOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          variant="outlined"
          InputProps={{
            startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: 'text.secondary', alignSelf: 'flex-start' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Priority Level</InputLabel>
          <Select
            value={priority}
            label="Priority Level"
            onChange={(e) => setPriority(e.target.value)}
            startAdornment={<PriorityHighOutlined sx={{ mr: 1, color: 'text.secondary' }} />}
            sx={{
              bgcolor: 'background.paper',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          >
            <MenuItem value="Low">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label="Low" color="success" size="small" />
                <Typography>Low Priority</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="Medium">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label="Medium" color="warning" size="small" />
                <Typography>Medium Priority</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="High">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label="High" color="error" size="small" />
                <Typography>High Priority</Typography>
              </Stack>
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !title.trim()}
          startIcon={<CreateOutlined />}
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #115293, #1976d2)',
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {loading ? 'Creating...' : 'Create Ticket'}
        </Button>
      </Box>
    </Box>
  );
}

export default TicketForm;
