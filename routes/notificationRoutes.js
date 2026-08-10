const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");


// Get logged-in user's notifications
router.get(
    "/",
    protect,
    getMyNotifications
);


// Mark all as read
router.put(
    "/read-all",
    protect,
    markAllAsRead
);


// Mark one notification as read
router.put(
    "/:id/read",
    protect,
    markAsRead
);


module.exports = router;