const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


const updateProfile = async (req, res) => {

    try {

        const { name, phone } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        user.name = name || user.name;
        user.phone = phone || user.phone;

        await user.save();

        res.json({

            message: "Profile Updated Successfully",

            user: {

                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


const changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword

        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!isMatch) {

            return res.status(400).json({

                message: "Current Password is Incorrect"

            });

        }

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(

            newPassword,

            salt

        );

        await user.save();

        res.json({

            message: "Password Changed Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


const getWorkers = async (req, res) => {

    try {

        const workers = await User.find(

            { role: "worker" },

            "name email"

        );

        res.json(workers);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

module.exports = {

    getWorkers,

    getProfile,

    updateProfile,

    changePassword

};