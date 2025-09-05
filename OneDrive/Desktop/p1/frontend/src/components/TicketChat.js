import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const TicketChat = ({ ticket, currentUser, onAddComment, onUpdateComment, onDeleteComment }) => {
  const theme = useTheme();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.comments]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await onAddComment(ticket._id, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await onUpdateComment(ticket._id, commentId, editText.trim());
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment(ticket._id, commentId);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleMenuClick = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const startEdit = () => {
    setEditingComment(selectedComment._id);
    setEditText(selectedComment.text);
    handleMenuClose();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCommentType = (comment) => {
    if (comment.isSystemComment) return 'system';
    if (comment.isInternal) return 'internal';
    return 'public';
  };

  const getCommentTypeColor = (type) => {
    switch (type) {
      case 'system': return theme.palette.info.main;
      case 'internal': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight={600}>
          Comments & Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ticket.comments?.length || 0} comments
        </Typography>
      </Box>

      {/* Comments List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {ticket.comments?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No comments yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ticket.comments?.map((comment, index) => {
              const commentType = getCommentType(comment);
              const isOwnComment = comment.user?._id === currentUser?._id;
              const isEditing = editingComment === comment._id;

              return (
                <Box key={comment._id || index}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      ...(commentType === 'system' && {
                        justifyContent: 'center',
                        '& .comment-content': {
                          bgcolor: 'action.hover',
                          borderRadius: 2,
                          px: 2,
                          py: 1
                        }
                      })
                    }}
                  >
                    {commentType !== 'system' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: getCommentTypeColor(commentType)
                        }}
                      >
                        {comment.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                    )}

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {commentType !== 'system' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {comment.user?.name || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(comment.createdAt)}
                          </Typography>
                          {commentType === 'internal' && (
                            <Chip
                              label="Internal"
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          )}
                        </Box>
                      )}

                      <Box className="comment-content">
                        {isEditing ? (
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                            <TextField
                              fullWidth
                              multiline
                              maxRows={4}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              size="small"
                            />
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleEditComment(comment._id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditingComment(null);
                                setEditText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              bgcolor: commentType === 'system' ? 'action.hover' : 'background.paper',
                              borderColor: commentType === 'system' ? 'transparent' : 'divider'
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {comment.text}
                            </Typography>
                          </Paper>
                        )}
                      </Box>
                    </Box>

                    {commentType !== 'system' && isOwnComment && !isEditing && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, comment)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Comment Input */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {currentUser?.name?.charAt(0) || 'U'}
          </Avatar>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
            size="small"
          />
          <Tooltip title="Attach file">
            <IconButton size="small" color="primary">
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleSendComment}
            disabled={!newComment.trim() || loading}
            startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Box>

      {/* Comment Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={startEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 16 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteComment(selectedComment?._id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TicketChat;
