const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const complaintRoutes =
    require("./routes/complaintRoutes");

const userRoutes =
    require("./routes/userRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");


dotenv.config();

connectDB();

const app = express();


// Needed when deployed behind a proxy
app.set("trust proxy", 1);


// Security headers
app.use(helmet());


// CORS
const allowedOrigin =
    process.env.CLIENT_URL ||
    "http://localhost:5173";

app.use(cors({

    origin: allowedOrigin

}));


// Limit JSON request size
app.use(
    express.json({
        limit: "10kb"
    })
);


// General API rate limiting
const apiLimiter = rateLimit({

    windowMs:
        15 * 60 * 1000,

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many requests. Please try again later."

    }

});


app.use(
    "/api",
    apiLimiter
);


// Uploaded images
app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// Routes
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/complaints",
    complaintRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);


// Test route
app.get(
    "/",
    (req, res) => {

        res.send(
            "Smart Civic Issue Management System API is Running..."
        );

    }
);


// Central error handler
app.use(
    (err, req, res, next) => {

        console.error(err);

        if (
            err.name === "MulterError"
        ) {

            if (
                err.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    message:
                        "Image must be 5 MB or smaller."

                });

            }

            return res.status(400).json({

                message:
                    "Image upload failed."

            });

        }


        if (
            err.message ===
            "Only image files are allowed."
        ) {

            return res.status(400).json({

                message:
                    err.message

            });

        }


        res.status(500).json({

            message:
                "Server Error"

        });

    }
);


const PORT =
    process.env.PORT ||
    5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);