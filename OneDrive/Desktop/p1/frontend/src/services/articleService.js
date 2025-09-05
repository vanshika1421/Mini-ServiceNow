import axios from 'axios';

const API_URL = '/api/articles';

export const getArticles = async (params) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getArticleById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createArticle = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateArticle = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteArticle = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const likeArticle = async (id, token) => {
  // Placeholder for like functionality if needed
  return {};
};

export const markHelpful = async (id, helpful, token) => {
  const res = await axios.post(`${API_URL}/articles/${id}/helpful`, { helpful }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
