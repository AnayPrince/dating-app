  import express from "express";
  import mongoose from "mongoose";
  import http from "http";
  import { Server } from "socket.io";
  import cors from "cors";
  import jwt from "jsonwebtoken";
  import authRoutes from "./routes/auth.js";

  import { socketHandler } from "./socket/socket.js";
  import Message from "./models/Message.js";
  import User from "./models/User.js";
  import Match from "./models/Match.js";
  import bcrypt from "bcryptjs";
  import userRoutes from "./routes/users.js";
  import likeRoutes from "./routes/like.js";
  import authMiddleware from "./middleware/authMiddleware.js";
  import uploadRoutes from "./routes/upload.js";
  import messageRoutes from "./routes/message.js";
  import multer from "multer";
  import path from "path";
  import fs from "fs";
  import dotenv from "dotenv";
  dotenv.config();

  const app = express();

  // ✅ middleware
  app.use(cors({
    origin: "http://localhost:3000",
  }));
  app.use(express.json());

  // ✅ routes
  app.use("/api", userRoutes);
  app.use("/api", likeRoutes);
  app.use("/api", uploadRoutes);
  app.use("/api", messageRoutes);
  app.use("/api/auth", authRoutes);
  // ======================
  // 📷 MULTER CONFIG
  // ======================

  // uploads folder auto create
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage }); //IMPORTANT

  // ======================
  // 📂 STATIC FOLDER
  // ======================
  app.use("/uploads", express.static("uploads"));

  // ======================
  // 📤 UPLOAD API
  // ======================
  app.post("/api/upload", upload.single("image"), (req, res) => {
    res.json({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    });
  });


  // ✅ MongoDB connect
  mongoose.connect("mongodb://localhost:27017/datingapp")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


  // =======================
  // 📝 REGISTER API
  // =======================
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // check existing user
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // =======================
  // 🔐 LOGIN API (FIXED)
  // =======================
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // ✅ check user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // ✅ check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // ✅ create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // ✅ FINAL RESPONSE (IMPORTANT)
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // =======================
  // 💖 GET MATCHES API
  // =======================
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const matches = await Match.find({
        users: req.params.userId,
        matched: true
      }).populate("users", "name email");

      res.json(matches); // MUST be array

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // =======================
  // 💬 GET MESSAGES API
  // =======================
  // 🔥 PROTECTED MESSAGE API
  // app.get("/api/messages/:userId/:chatUserId", authMiddleware, async (req, res) => {
  //   try {
  //     const { userId, chatUserId } = req.params;

  //     const messages = await Message.find({
  //       $or: [
  //         { sender: userId, receiver: chatUserId },
  //         { sender: chatUserId, receiver: userId },
  //       ],
  //     });

  //     res.json(messages);

  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });


  // =======================
  // 🌐 SOCKET SETUP
  // =======================
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  socketHandler(io);


  // =======================
  // 🚀 START SERVER
  // =======================
  server.listen(5000, () => {
    console.log("Server running on 5000");
  });