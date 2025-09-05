const express = require("express");
const router = express.Router();
const { createTicket, getTickets, updateTicket } = require("../controllers/ticketController");
const { analytics, addComment, getHistory } = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.put("/:id", protect, updateTicket);
router.get("/analytics", protect, analytics);
router.post('/:id/comments', protect, addComment);
router.get('/:id/history', protect, getHistory);

module.exports = router;
