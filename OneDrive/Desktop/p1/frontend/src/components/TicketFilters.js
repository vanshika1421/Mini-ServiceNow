import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Button,
  Typography,
  Divider,
  Autocomplete,
  DatePicker
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

const TicketFilters = ({ onFiltersChange, tickets = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedTo: '',
    createdBy: '',
    dateRange: { start: null, end: null },
    slaStatus: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique values for filter options
  const getUniqueValues = (field) => {
    const values = tickets.map(ticket => {
      if (field === 'assignedTo' || field === 'createdBy') {
        return ticket[field]?.name || 'Unassigned';
      }
      return ticket[field];
    }).filter(Boolean);
    return [...new Set(values)];
  };

  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const categoryOptions = getUniqueValues('category');
  const assigneeOptions = getUniqueValues('assignedTo');
  const slaStatusOptions = ['On Track', 'At Risk', 'Breached'];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    applyFilters(value, filters);
  };

  const applyFilters = (search, filterValues) => {
    const filteredTickets = tickets.filter(ticket => {
      // Search term filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          ticket.title?.toLowerCase().includes(searchLower) ||
          ticket.description?.toLowerCase().includes(searchLower) ||
          ticket._id?.toLowerCase().includes(searchLower) ||
          ticket.assignedTo?.name?.toLowerCase().includes(searchLower) ||
          ticket.createdBy?.name?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filterValues.status && ticket.status !== filterValues.status) {
        return false;
      }

      // Priority filter
      if (filterValues.priority && ticket.priority !== filterValues.priority) {
        return false;
      }

      // Category filter
      if (filterValues.category && ticket.category !== filterValues.category) {
        return false;
      }

      // Assignee filter
      if (filterValues.assignedTo) {
        const assigneeName = ticket.assignedTo?.name || 'Unassigned';
        if (assigneeName !== filterValues.assignedTo) {
          return false;
        }
      }

      // Date range filter
      if (filterValues.dateRange.start || filterValues.dateRange.end) {
        const ticketDate = new Date(ticket.createdAt);
        if (filterValues.dateRange.start && ticketDate < filterValues.dateRange.start) {
          return false;
        }
        if (filterValues.dateRange.end && ticketDate > filterValues.dateRange.end) {
          return false;
        }
      }

      // SLA Status filter
      if (filterValues.slaStatus) {
        // This would need to be calculated based on SLA logic
        // For now, we'll skip this filter
      }

      return true;
    });

    onFiltersChange(filteredTickets, { search, filters: filterValues });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: '',
      priority: '',
      category: '',
      assignedTo: '',
      createdBy: '',
      dateRange: { start: null, end: null },
      slaStatus: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    applyFilters('', clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    Object.values(filters).forEach(value => {
      if (value && typeof value === 'string') count++;
      if (value && typeof value === 'object' && (value.start || value.end)) count++;
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 2 }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search tickets by title, description, ID, or assignee..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => handleSearchChange('')}>
                  <ClearIcon />
                </IconButton>
              )
            }}
          />
          <Button
            variant={showAdvanced ? 'contained' : 'outlined'}
            startIcon={<FilterListIcon />}
            endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </Box>

        {/* Quick Filters */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              label="Priority"
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {priorityOptions.map(priority => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categoryOptions.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {activeFilterCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Advanced Filters */}
        {showAdvanced && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters
            </Typography>
          
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={filters.assignedTo}
                  label="Assigned To"
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Unassigned">Unassigned</MenuItem>
                  {assigneeOptions.map(assignee => (
                    <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>SLA Status</InputLabel>
                <Select
                  value={filters.slaStatus}
                  label="SLA Status"
                  onChange={(e) => handleFilterChange('slaStatus', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {slaStatusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <MuiDatePicker
                label="Created From"
                value={filters.dateRange.start}
                onChange={(date) => handleFilterChange('dateRange', { ...filters.dateRange, start: date })}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <MuiDatePicker
                label="Created To"
                value={filters.dateRange.end}
                onChange={(date) => handleFilterChange('dateRange', { ...filters.dateRange, end: date })}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Box>
          </Box>
        )}

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  size="small"
                  onDelete={() => handleSearchChange('')}
                />
              )}
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                if (key === 'dateRange' && (value.start || value.end)) {
                  return (
                    <Chip
                      key={key}
                      label={`Date: ${value.start?.toLocaleDateString() || 'Any'} - ${value.end?.toLocaleDateString() || 'Any'}`}
                      size="small"
                      onDelete={() => handleFilterChange('dateRange', { start: null, end: null })}
                    />
                  );
                }
                if (typeof value === 'string') {
                  return (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      size="small"
                      onDelete={() => handleFilterChange(key, '')}
                    />
                  );
                }
                return null;
              })}
            </Box>
          </Box>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default TicketFilters;
