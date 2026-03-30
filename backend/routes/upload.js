import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// 📂 ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 📷 storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 🌍 BASE URL (dynamic for production)
const BASE_URL =
  process.env.BASE_URL || "http://localhost:5000";

// 📤 UPLOAD API
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // ⏳ delete after 45 sec (self-destruct image)
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.log("❌ Delete error:", err);
        else console.log("✅ File deleted:", filePath);
      });
    }, 45000);

    res.json({
      imageUrl: `${BASE_URL}/${filePath}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;