const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { getProfile, updateProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
