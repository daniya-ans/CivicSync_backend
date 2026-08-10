const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        cb(

            null,

            Date.now() + path.extname(file.originalname)

        );

    }

});

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".jfif"
    ];

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
        allowedExtensions.includes(extension) &&
        allowedMimeTypes.includes(file.mimetype)
    ) {

        cb(null, true);

    } else {

        cb(new Error("Only image files are allowed."));

    }

};
const upload = multer({

    storage,

    fileFilter

});

module.exports = upload;