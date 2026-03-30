import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), (req, res) => {

  const filePath = req.file.path;

  // ⏳ delete after 45 sec
  setTimeout(() => {
    fs.unlink(filePath, () => {});
  }, 45000);

  res.json({
    imageUrl: `http://localhost:5000/${filePath}`
  });
});

export default router;