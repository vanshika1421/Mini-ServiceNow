const Article = require('../models/Article');

// GET /api/articles
exports.getArticles = async (req, res) => {
  const { search, category, sort } = req.query;
  let query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  let articles = await Article.find(query);
  if (sort === 'recent') articles = articles.sort((a, b) => b.createdAt - a.createdAt);
  if (sort === 'oldest') articles = articles.sort((a, b) => a.createdAt - b.createdAt);
  res.json(articles);
};

// GET /api/articles/:id
exports.getArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
};

// POST /api/articles
exports.createArticle = async (req, res) => {
  const article = new Article(req.body);
  await article.save();
  res.status(201).json(article);
};

// PUT /api/articles/:id
exports.updateArticle = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
};

// DELETE /api/articles/:id
exports.deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
