const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

// Protected Route
router.get("/profile", protect, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user
    });

});

// Admin Route
router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;