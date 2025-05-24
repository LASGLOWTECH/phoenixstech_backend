const multer = require('multer');

// Set up the storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (ext === 'pdf') {
      cb(null, '../client/public/upload/files'); // PDFs go here
    } else {
      cb(null, '../client/public/upload/images'); // Images go here
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// File filter to allow only specific file types (jpeg, jpg, png, pdf)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = file.originalname.toLowerCase().split('.').pop();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF or image files are allowed'), false);
  }
};

// Initialize Multer with the storage and file filter configuration
const fileUpload = multer({ storage, fileFilter });

module.exports = fileUpload;



// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Determine environment
// const isLocalhost = process.env.NODE_ENV !== 'production'; // Defaults to development if not set

// // Utility to ensure a directory exists
// const ensureDirExists = (dirPath) => {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }
// };

// // Set the storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const ext = file.originalname.toLowerCase().split('.').pop();

//     let uploadDir;

//     if (ext === 'pdf') {
//       uploadDir = isLocalhost
//         ? path.join(__dirname, '../client/public/upload/files')
//         : path.join(__dirname, '../uploads/files');
//     } else {
//       uploadDir = isLocalhost
//         ? path.join(__dirname, '../client/public/upload/images')
//         : path.join(__dirname, '../uploads/images');
//     }

//     ensureDirExists(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// // Allow only jpeg, jpg, png, and pdf
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf/;
//   const ext = file.originalname.toLowerCase().split('.').pop();

//   if (allowedTypes.test(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF or image files are allowed'), false);
//   }
// };

// const fileUpload = multer({ storage, fileFilter });

// module.exports = fileUpload;
