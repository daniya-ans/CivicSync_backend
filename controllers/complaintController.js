const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");

const createComplaint = async (req, res) => {

    try {

        console.log("==============");
        console.log("BODY");
        console.log(req.body);

        console.log("FILE");
        console.log(req.file);

        console.log("USER");
        console.log(req.user);

        console.log("==============");

        if (!req.body) {

            return res.status(400).json({

                message: "Body is undefined"

            });

        }

        const category = req.body.category;
        const description = req.body.description;
        const location = req.body.location;

        const complaint = new Complaint({

            user: req.user.id,

            category,

            description,

            location,

            image: req.file ? req.file.filename : ""

        });

        await complaint.save();

        res.status(201).json(complaint);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

const getMyComplaints = async (req,res)=>{

    try{

        const complaints = await Complaint.find({

            user:req.user.id

        });

        res.json(complaints);

    }

    catch(error){

        res.status(500).json({

            message:"Server Error"

        });

    }

};

const getComplaintById = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id)
            .populate("assignedWorker", "name");

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });

        }

        res.json(complaint);

    }

    catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};

const getAllComplaints = async (req, res) => {

    try {

        let complaints;

        if (req.user.role === "worker") {

            complaints = await Complaint.find({

                assignedWorker: req.user.id

            })

            .populate("user", "name email role")

            .populate("assignedWorker", "name");

        }

        else {

            complaints = await Complaint.find()

            .populate("user", "name email role")

            .populate("assignedWorker", "name");

        }

        res.json(complaints);

    }

    catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

};

const verifyComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });

        }

        if (complaint.status !== "Pending") {

            return res.status(400).json({
                message: "Only pending complaints can be verified."
            });

        }

        complaint.status = "Verified";

        await complaint.save();

        await Notification.create({

            recipient: complaint.user,

            message: `Your ${complaint.category} complaint has been verified by the NGO.`,

            type: "Complaint Verified",

            complaint: complaint._id

        });

        res.json({

            success: true,
            message: "Complaint Verified Successfully",
            complaint

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

};

const approveComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });

        }

        if (complaint.status !== "Verified") {

            return res.status(400).json({
                message: "Only verified complaints can be approved."
            });

        }

        if (!complaint.assignedWorker) {

            return res.status(400).json({
                message: "Please assign a worker before approving the complaint."
            });

        }

        complaint.status = "Approved";

        await complaint.save();

        await Notification.create({

            recipient: complaint.user,

            message: `Your ${complaint.category} complaint has been approved by the government.`,

            type: "Complaint Approved",

            complaint: complaint._id

        });

        res.json({

            message: "Complaint Approved"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

const assignWorker = async (req, res) => {

    try {

        const { workerId } = req.body;

        if (!workerId) {

            return res.status(400).json({
                message: "Worker selection is required."
            });

        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });

        }

        if (complaint.status !== "Verified") {

            return res.status(400).json({
                message: "Worker can only be assigned to a verified complaint."
            });

        }

        complaint.assignedWorker = workerId;

        await complaint.save();


        // Notify Worker
        await Notification.create({

            recipient: workerId,

            message: `You have been assigned a new ${complaint.category} complaint.`,

            type: "Worker Assigned",

            complaint: complaint._id

        });


        res.json({

            message: "Worker Assigned"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

const updateComplaintStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });

        }

        // Worker can update only their own assigned complaint
        if (
            req.user.role === "worker" &&
            String(complaint.assignedWorker) !== String(req.user.id)
        ) {

            return res.status(403).json({
                message: "You are not assigned to this complaint."
            });

        }

        // Approved/Assigned → In Progress
        if (
            status === "In Progress" &&
            complaint.status !== "Approved" &&
            complaint.status !== "Assigned"
        ) {

            return res.status(400).json({
                message: "Complaint must be approved or assigned before starting work."
            });

        }

        // In Progress → Resolved
        if (
            status === "Resolved" &&
            complaint.status !== "In Progress"
        ) {

            return res.status(400).json({
                message: "Complaint must be in progress before it can be resolved."
            });

        }

        // Only allow these worker status updates
        if (
            status !== "In Progress" &&
            status !== "Resolved"
        ) {

            return res.status(400).json({
                message: "Invalid status update."
            });

        }

        complaint.status = status;

        await complaint.save();

        await Notification.create({

            recipient: complaint.user,

            message: `Your ${complaint.category} complaint status has been updated to ${status}.`,

            type: "Status Updated",

            complaint: complaint._id

        });

        res.json({

            message: "Complaint Updated"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};



module.exports = {

    createComplaint,

    getMyComplaints,

    getComplaintById,

    getAllComplaints,

    verifyComplaint,

    approveComplaint,

    assignWorker,

    updateComplaintStatus,

};