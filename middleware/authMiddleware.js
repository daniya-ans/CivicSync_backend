const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    let token;

    // Check if Authorization header exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {

        // Extract Token
        token = req.headers.authorization.split(" ")[1];

        try {

            // Verify Token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Save decoded user info
            req.user = decoded;

            // Continue to next middleware
            next();

        } catch (error) {

            console.log(error);

            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });

        }

    } else {

        return res.status(401).json({
            success: false,
            message: "No Token Provided"
        });

    }

};

module.exports = {
    protect
};