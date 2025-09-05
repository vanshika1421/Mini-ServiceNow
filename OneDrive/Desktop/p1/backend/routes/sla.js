const express = require("express");
const { getSLAs, createSLA, updateSLA, getSLAMetrics } = require("../controllers/slaController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all SLAs
router.get("/", protect, getSLAs);

// Create new SLA (admin only)
router.post("/", protect, admin, createSLA);

// Update SLA (admin only)
router.put("/:id", protect, admin, updateSLA);

// Get SLA metrics
router.get("/metrics", protect, getSLAMetrics);

module.exports = router;
