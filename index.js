// index.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const fileUpload = require('./middlewares/upload'); // for /upload/files route

const postRoutes = require('./routes/posts.js');
const consultationRoutes = require('./routes/consultation.js');
const contactRoutes = require('./routes/contacts.js');
const subscribRoutes = require('./routes/subscribe.js');
const authRoutes = require('./routes/auth.js');

const { port, allowedDomains } = config;
const app = express();

// 1️⃣ CORS & Middlewares
app.use(cors({
  origin: allowedDomains,
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 2️⃣ Environment detection
const isDev = process.env.NODE_ENV !== 'production';

// 3️⃣ Static serving of production uploads
if (!isDev) {
  app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
  );
}

// 4️⃣ Utility to ensure a directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 5️⃣ Multer storage (images only; files use fileUpload middleware)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = file.originalname.toLowerCase().split('.').pop();

    // base folder differs by env
    const base = isDev
      ? path.join(__dirname, '../client/public/upload')
      : path.join(__dirname, 'uploads');

    const sub = ext === 'pdf' ? 'files' : 'images';
    const uploadDir = path.join(base, sub);

    ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 6️⃣ Multer instance for image uploads
const imageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    cb(null, allowed.test(ext));
  }
});

// 7️⃣ Routes for uploads
app.post(
  '/upload/images',
  imageUpload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json(req.file.filename);
  }
);

app.post(
  '/upload/files',
  fileUpload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
  }
);

// 8️⃣ API routes
app.use('/posts', postRoutes);
app.use('/consultation', consultationRoutes);
app.use('/auth', authRoutes);
app.use('/subscribe', subscribRoutes);
app.use('/contacts', contactRoutes);

// 9️⃣ Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port} (dev: ${isDev})`);
});
