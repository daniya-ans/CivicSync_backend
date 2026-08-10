const User = require("../models/User");
const Complaint = require("../models/Complaint");

const getDashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalComplaints = await Complaint.countDocuments();

        const pending = await Complaint.countDocuments({ status: "Pending" });

        const verified = await Complaint.countDocuments({ status: "Verified" });

        const approved = await Complaint.countDocuments({ status: "Approved" });

        const assigned = await Complaint.countDocuments({ status: "Assigned" });

        const inProgress = await Complaint.countDocuments({ status: "In Progress" });

        const resolved = await Complaint.countDocuments({ status: "Resolved" });

        const rejected = await Complaint.countDocuments({ status: "Rejected" });

        res.json({
            totalUsers,
            totalComplaints,
            pending,
            verified,
            approved,
            assigned,
            inProgress,
            resolved,
            rejected
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    getDashboardStats
};