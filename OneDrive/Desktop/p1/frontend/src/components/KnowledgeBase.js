import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  Button,
  IconButton,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Skeleton,
  Grow
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Computer as TechIcon,
  NetworkWifi as NetworkIcon,
  Security as SecurityIcon,
  Hardware as HardwareIcon,
  Visibility as ViewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Help as HelpIcon,
  Business as BusinessIcon,
  CloudQueue as CloudIcon,
  Hub as IntegrationIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ArticleForm from './ArticleForm';

import {
  getArticles,
  likeArticle,
  markHelpful,
  createArticle,
  updateArticle,
  deleteArticle
} from '../services/articleService';

import { useRole } from '../contexts/RoleContext';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const { role } = useRole();

  useEffect(() => {
    loadArticles();
  }, [searchTerm, selectedCategory, sortBy]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy
      };
      const data = await getArticles(params);
      setArticles(data);
      // Extract categories from articles
      const cats = Array.from(new Set(data.map(a => a.category))).map(name => ({ name, count: data.filter(a => a.category === name).length, color: '#1976D2' }));
      setCategories(cats);
      setLoading(false);
    } catch (err) {
      setError('Failed to load knowledge articles');
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setArticleDialogOpen(true);
    setArticles(prev => prev.map(a => 
      a._id === article._id ? { ...a, views: a.views + 1 } : a
    ));
  };

  const handleBookmark = (articleId) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleHelpful = (articleId, isHelpful) => {
    setArticles(prev => prev.map(article => {
      if (article._id === articleId) {
        return {
          ...article,
          helpful: isHelpful ? article.helpful + 1 : article.helpful,
          notHelpful: !isHelpful ? article.notHelpful + 1 : article.notHelpful
        };
      }
      return article;
    }));
  };

  const filteredArticles = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    return articles
      .filter(article => {
        if (!article) return false;
        const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (article.tags && article.tags.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        switch (sortBy) {
          case 'recent':
            return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
          case 'popular':
            return (b.views || 0) - (a.views || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'helpful':
            return (b.helpful || 0) - (a.helpful || 0);
          default:
            return 0;
        }
      });
  }, [articles, searchTerm, selectedCategory, sortBy]);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Platform Basics':
        return <BusinessIcon />;
      case 'ITSM Processes':
        return <IntegrationIcon />;
      case 'Service Catalog':
        return <CloudIcon />;
      case 'Security & Compliance':
        return <SecurityIcon />;
      case 'Integration & APIs':
        return <TechIcon />;
      case 'Reporting & Analytics':
        return <ArticleIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#1976D2';
  };

  // Main render
  return (
    <Box>
      {error ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button onClick={loadArticles} variant="contained">
            Retry
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          {/* Admin Add Article Button */}
          {role === 'admin' && !showForm && (
            <Box sx={{ mb: 2, textAlign: 'right' }}>
              <Button variant="contained" color="primary" onClick={handleAddArticle}>
                Add Article
              </Button>
            </Box>
          )}
          {/* ...existing code... */}
        </Box>
      )}
    </Box>
  );
};

export default KnowledgeBase;
