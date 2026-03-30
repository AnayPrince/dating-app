import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import likeRoutes from "./routes/like.js";
import uploadRoutes from "./routes/upload.js";
import messageRoutes from "./routes/message.js";
import { socketHandler } from "./socket/socket.js";

dotenv.config();

const app = express();

// ✅ CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://dating-gtoxx6vf9-anayprinces-projects.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true
}));

app.options("*", cors());

// ✅ middleware
app.use(express.json());

// ✅ static uploads
app.use("/uploads", express.static("uploads"));

// ✅ routes
app.use("/api", userRoutes);
app.use("/api", likeRoutes);
app.use("/api", uploadRoutes);
app.use("/api", messageRoutes);
app.use("/api/auth", authRoutes);

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.log);

// ✅ server + socket
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

socketHandler(io);

// ✅ start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});