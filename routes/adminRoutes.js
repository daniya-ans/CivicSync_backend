const express = require("express");

const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    getDashboardStats
);

module.exports = router;