
const dotenv = require('dotenv');

dotenv.config();
const fileUpload = require('./middlewares/upload')
const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/posts.js');
const cookieParser = require("cookie-parser")
const config = require('./config');
const multer = require('multer');
const app = express()
const consultationRoutes=require('./routes/consultation.js')
const contactRoutes = require('./routes/contacts.js')
const subscribRoutes = require('./routes/subscribe.js')
const authRoutes = require('./routes/auth.js');
const { port, allowedDomains } = config;



app.use(cors({
    origin: allowedDomains, // Use your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed HTTP methods
    credentials: true // If you need to include cookies or credentials in the request
}));

app.use(express.json())
app.use(cookieParser());


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




console.log(storage);




const imageUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});



app.post('/upload/images', imageUpload.single('file'), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});

// ✅ Upload config for consultation (jpeg, jpg, png, pdf)

app.post('/upload/files', fileUpload.single('file'), (req, res) => {
    const file = req.file;
    res.status(200).json({ message: 'File uploaded successfully', filename: file.filename });
});


app.use("/posts", postRoutes)
app.use("/consultation", consultationRoutes)

app.use("/auth", authRoutes)
app.use("/subscribe", subscribRoutes)
app.use("/contacts", contactRoutes)

app.listen('5000', () => {
    console.log(`app listening point ${port}`);

})
