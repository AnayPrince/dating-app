import express from "express";
import User from "../models/User.js";
import aiService from "../services/aiService.js";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
/* Test route */
router.get("/test", (req, res) => {
  res.json({
    message: "User route working",
  });
});

/* Get all users */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    });

    res.json(users);
  } catch (err) {
    console.error("Users Fetch Error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// /* AI route */
// router.post("/ai-message", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "http://127.0.0.1:11434/api/generate", // 👈 ollama API
//       {
//         model: "llama3",
//         prompt: `Generate a short dating message based on: ${req.body.interests}`,
//         stream: false,
//       }
//     );

//     // 🔥 FIX HERE
//     res.json({
//       message: response.data.response,
//     });

//   } catch (error) {
//     console.log(error.message);

//     res.status(500).json({
//       message: "AI service failed",
//     });
//   }
// });

export default router;