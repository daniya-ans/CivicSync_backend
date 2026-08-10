const Complaint = require("../models/Complaint");

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

const approveComplaint = async(req,res)=>{

    try{

        const complaint = await Complaint.findById(req.params.id);

        complaint.status = "Approved";

        await complaint.save();

        res.json({

            message:"Complaint Approved"

        });

    }

    catch(error){

        res.status(500).json({

            message:"Server Error"

        });

    }

};

const assignWorker = async(req,res)=>{

    try{

        const {

            workerId

        } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        complaint.assignedWorker = workerId;

        complaint.status = "Assigned";

        await complaint.save();

        res.json({

            message:"Worker Assigned"

        });

    }

    catch(error){

        res.status(500).json({

            message:"Server Error"

        });

    }

};

const updateComplaintStatus = async(req,res)=>{

    try{

        const {

            status

        } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        complaint.status = status;

        await complaint.save();

        res.json({

            message:"Complaint Updated"

        });

    }

    catch(error){

        res.status(500).json({

            message:"Server Error"

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