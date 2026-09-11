const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});

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
router.post("/login", loginLimiter, loginUser);



module.exports = router;