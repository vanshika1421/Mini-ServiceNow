const Article = require("../models/Article");

// Get all articles with search, filter, sort
const getArticles = async (req, res) => {
    try {
        const { category, search, sort = 'recent', limit = 10, page = 1 } = req.query;
        let query = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'popular') sortOption = { likes: -1 };
        const articles = await Article.find(query)
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single article by ID
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new article (admin only)
const createArticle = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const article = new Article({
            title,
            content,
            category,
            author: req.user.name
        });
        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update article (admin only)
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete article (admin only)
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rate article helpfulness
const rateArticle = async (req, res) => {
    try {
        const { helpful } = req.body; // true for helpful, false for not helpful
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        if (helpful) {
            article.helpful += 1;
        } else {
            article.notHelpful += 1;
        }
        await article.save();
        res.json({ 
            helpful: article.helpful, 
            notHelpful: article.notHelpful,
            helpfulnessRatio: (article.helpful / (article.helpful + article.notHelpful) * 100).toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get knowledge base statistics
const getKBStats = async (req, res) => {
    try {
        const totalArticles = await Article.countDocuments();
        const categoryStats = await Article.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const topArticles = await Article.find()
            .sort({ likes: -1 })
            .limit(5)
            .select("title likes helpful notHelpful");
        res.json({
            totalArticles,
            categoryStats,
            topArticles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    rateArticle,
    getKBStats
};
