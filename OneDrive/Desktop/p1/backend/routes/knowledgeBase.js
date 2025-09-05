const express = require("express");
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    rateArticle,
    getKBStats
} = require("../controllers/knowledgeBaseController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/stats", getKBStats);
router.get("/:id", getArticleById);
router.post("/:id/rate", protect, rateArticle);

// Admin routes
router.post("/", protect, admin, createArticle);
router.put("/:id", protect, admin, updateArticle);
router.delete("/:id", protect, admin, deleteArticle);

module.exports = router;
