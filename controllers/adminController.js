const User = require("../models/User");
const Complaint = require("../models/Complaint");

const getDashboardStats = async (req, res) => {

    try {

        const [
            totalUsers,
            totalComplaints,
            pending,
            verified,
            approved,
            assigned,
            inProgress,
            resolved,
            rejected,
            citizens,
            ngos,
            government,
            workers,
            admins,
            categoryStats,
            workerPerformance
        ] = await Promise.all([

            User.countDocuments(),

            Complaint.countDocuments(),

            Complaint.countDocuments({
                status: "Pending"
            }),

            Complaint.countDocuments({
                status: "Verified"
            }),

            Complaint.countDocuments({
                status: "Approved"
            }),

            Complaint.countDocuments({
                status: "Assigned"
            }),

            Complaint.countDocuments({
                status: "In Progress"
            }),

            Complaint.countDocuments({
                status: "Resolved"
            }),

            Complaint.countDocuments({
                status: "Rejected"
            }),

            User.countDocuments({
                role: "citizen"
            }),

            User.countDocuments({
                role: "ngo"
            }),

            User.countDocuments({
                role: "government"
            }),

            User.countDocuments({
                role: "worker"
            }),

            User.countDocuments({
                role: "admin"
            }),

            // Complaints grouped by category
            Complaint.aggregate([

                {
                    $group: {
                        _id: "$category",
                        count: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {
                        count: -1
                    }
                }

            ]),

            // Worker performance
            Complaint.aggregate([

                {
                    $match: {
                        assignedWorker: {
                            $ne: null
                        }
                    }
                },

                {
                    $group: {

                        _id: "$assignedWorker",

                        assigned: {
                            $sum: 1
                        },

                        resolved: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            "Resolved"
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        }

                    }

                },

                {
                    $lookup: {

                        from: "users",

                        localField: "_id",

                        foreignField: "_id",

                        as: "worker"

                    }

                },

                {
                    $unwind: "$worker"
                },

                {
                    $project: {

                        _id: 0,

                        name: "$worker.name",

                        assigned: 1,

                        resolved: 1

                    }

                },

                {
                    $sort: {

                        resolved: -1,

                        assigned: -1

                    }

                }

            ])

        ]);


        // Calculate resolution rate

        const resolutionRate =
            totalComplaints > 0

                ? Math.round(
                    (resolved / totalComplaints) * 100
                )

                : 0;


        res.json({

            totalUsers,

            totalComplaints,

            pending,

            verified,

            approved,

            assigned,

            inProgress,

            resolved,

            rejected,

            resolutionRate,

            usersByRole: {

                citizens,

                ngos,

                government,

                workers,

                admins

            },

            categoryStats:

                categoryStats.map((item) => ({

                    category:
                        item._id || "Other",

                    count:
                        item.count

                })),

            workerPerformance

        });

    }

    catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};


module.exports = {
    getDashboardStats
};