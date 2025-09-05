const express = require('express');
const router = express.Router();
const { getAllUsers, getUserTickets } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin: get all users
router.get('/', protect, admin, getAllUsers);

// User: get their own tickets
router.get('/me/tickets', protect, getUserTickets);

module.exports = router;
