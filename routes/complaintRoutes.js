const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

const {

createComplaint,

getMyComplaints,

getComplaintById,

getAllComplaints,

verifyComplaint,

approveComplaint,

assignWorker,

updateComplaintStatus

} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
    "/",
    protect,
    upload.single("image"),
    (req, res, next) => {

        console.log("BODY:", req.body);

        console.log("FILE:", req.file);

        next();

    },
    createComplaint
);

router.get("/my", protect, getMyComplaints);

router.get("/", protect, authorizeRoles("ngo", "government", "worker", "admin"), getAllComplaints);

router.get("/:id", protect, getComplaintById);

router.put("/verify/:id", protect, authorizeRoles("ngo"), verifyComplaint);

router.put("/approve/:id", protect, authorizeRoles("government"), approveComplaint);

router.put("/assign/:id", protect, authorizeRoles("government"), assignWorker);

router.put("/status/:id", protect, authorizeRoles("worker"), updateComplaintStatus);


module.exports = router;