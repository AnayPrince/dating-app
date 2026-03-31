// import express from "express";
// import mongoose from "mongoose";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import dotenv from "dotenv";

// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/users.js";
// import likeRoutes from "./routes/like.js";
// import uploadRoutes from "./routes/upload.js";
// import messageRoutes from "./routes/message.js";
// import { socketHandler } from "./socket/socket.js";

// dotenv.config();

// const app = express();

// // 🔥 SIMPLE & WORKING CORS (FINAL FIX)
// app.use(cors({
//   origin: true,   // ✅ auto allow all origins
//   credentials: true
// }));

// // ✅ preflight fix
// app.options("*", cors());

// // ✅ middleware
// app.use(express.json());

// // ✅ static uploads
// app.use("/uploads", express.static("uploads"));

// // ✅ routes
// app.use("/api", userRoutes);
// app.use("/api", likeRoutes);
// app.use("/api", uploadRoutes);
// app.use("/api", messageRoutes);
// app.use("/api/auth", authRoutes);

// // ✅ MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(console.log);

// // ✅ server + socket
// const server = http.createServer(app);

// // 🔥 SOCKET CORS FIX
// const io = new Server(server, {
//   cors: {
//     origin: true,
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ["websocket"] // MUST ADD
// });

// socketHandler(io);

// // ✅ start
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });

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

// ✅ CORS - Vercel ki koi bhi URL allow
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // Koi bhi vercel.app domain allow karo
    if (!origin || origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", likeRoutes);
app.use("/api", uploadRoutes);
app.use("/api", messageRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.log);

const server = http.createServer(app);

// ✅ Socket.io - same CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ dono rakhna zaroori
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});