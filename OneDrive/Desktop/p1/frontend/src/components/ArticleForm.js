import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';

const categories = [
  'Platform Basics',
  'ITSM Processes',
  'Service Catalog',
  'Security & Compliance',
  'Integration & APIs',
  'Reporting & Analytics'
];

const ArticleForm = ({ onSubmit, initialData = {}, isEdit = false, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category || categories[0]);
  const [summary, setSummary] = useState(initialData.summary || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, category, summary });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 600 }}>
      <Typography variant="h6" mb={2}>{isEdit ? 'Edit Article' : 'Add New Article'}</Typography>
      <TextField
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Category"
        select
        value={category}
        onChange={e => setCategory(e.target.value)}
        fullWidth
        required
        margin="normal"
      >
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        minRows={6}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? 'Update' : 'Add'}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outlined">Cancel</Button>
        )}
      </Box>
    </Box>
  );
};

export default ArticleForm;
