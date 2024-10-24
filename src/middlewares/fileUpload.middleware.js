const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '/../../uploads/'), // Change this to your desired folder path
    filename: function (req, file, cb) {
        console.log('::::file::::::', file);
        
        cb(null, Date.now() + '---' + file.originalname.split(' ').join('-'));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept file types (e.g., images, PDFs, Word docs)
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/; // Add more types if needed
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    console.log(':::::::::::::::::::');
    console.log('::::::::file:::',file);
    console.log(':::::::::::::::::::');
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new ApiError(httpStatus.NOT_ACCEPTABLE, "Format Not Allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Middleware function
const uploadImage = (key) => {
    return (req, res, next) => {
        // Call multer's single() to upload the image
        const uploadSingle = upload.single(key);
        console.log('req.file:::::',key);

        // Execute the upload
        uploadSingle(req, res, (err) => {
            console.log('err:::::',err)
            if (err) {
                return next(err); // Pass any error to next middleware (e.g., invalid file type, etc.)
            }

            // Image is uploaded, req.file will contain file info
            console.log('req.file:::::',req.file); // Optional: you can log or store this information if needed

            // Proceed to the next middleware/route
            next();
        });
    };
};

module.exports = uploadImage;