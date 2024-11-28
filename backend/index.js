const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require('dotenv').config();


const UserModel = require("./models/User");

app.use(cors());
app.use(express.json());

// Create 'public/images' directory if it doesn't exist
const uploadPath = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Serve static files
app.use(express.static('public/images'))


// Use environment variable for MongoDB connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Store files in the persistent disk directory
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single('file'), (req, res) => {
    UserModel.create({ image: req.file.filename })
        .then(result => res.status(200).json({ message: "File uploaded", data: result }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint to fetch uploaded images
app.get("/getImage", (req, res) => {
    UserModel.find()
        .then(result => res.json(result)) // Send the result back to the frontend
        .catch(err => res.status(500).json({ error: err.message }));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
