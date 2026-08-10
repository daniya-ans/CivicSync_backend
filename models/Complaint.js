const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Verified",
            "Approved",
            "Assigned",
            "In Progress",
            "Resolved",
            "Rejected"
        ],
        default: "Pending"
    },

    assignedWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Complaint", complaintSchema);