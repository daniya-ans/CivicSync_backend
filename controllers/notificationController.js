const Notification = require("../models/Notification");

// Get notifications for logged-in user
const getMyNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({
            recipient: req.user.id
        })
        .populate("complaint", "category status")
        .sort({ createdAt: -1 });

        res.json(notifications);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// Mark one notification as read
const markAsRead = async (req, res) => {

    try {

        const notification = await Notification.findOneAndUpdate(

            {
                _id: req.params.id,
                recipient: req.user.id
            },

            {
                read: true
            },

            {
                new: true
            }

        );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        res.json({
            success: true,
            message: "Notification marked as read"
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// Mark all notifications as read
const markAllAsRead = async (req, res) => {

    try {

        await Notification.updateMany(

            {
                recipient: req.user.id,
                read: false
            },

            {
                read: true
            }

        );

        res.json({
            success: true,
            message: "All notifications marked as read"
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

    getMyNotifications,
    markAsRead,
    markAllAsRead

};