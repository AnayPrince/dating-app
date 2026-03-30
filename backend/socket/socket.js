// 

import Message from "../models/Message.js";
import CryptoJS from "crypto-js";

const SECRET_KEY = "mySuperSecureKey123";

// 🔥 online users
let onlineUsers = new Map();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* ======================
       JOIN ROOM + ONLINE USERS
    ====================== */
    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(userId);

      // ✅ track online user
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;

      // 🔥 broadcast online users
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("Joined:", userId);
    });

    /* ======================
       SEND MESSAGE
    ====================== */
    socket.on("sendMessage", async (data) => {
      try {
        let { sender, receiver, message } = data;

        // ❌ validation fix
        if (!sender || !receiver || !message) return;

        let expiresAt = null;

        // 🧨 IMAGE SELF-DESTRUCT
        if (typeof message === "string" && message.startsWith("http")) {
          expiresAt = new Date(Date.now() + 10 * 1000);
        }

        // 🔐 ENCRYPT MESSAGE
        const encryptedMessage = CryptoJS.AES.encrypt(
          message,
          SECRET_KEY
        ).toString();

        // 💾 save
        const newMsg = await Message.create({
          sender,
          receiver,
          message: encryptedMessage,
          expiresAt,
          createdAt: new Date(),
          matchId: [sender, receiver].sort().join("_"),
        });

        // 📡 send to both users
        io.to(receiver).emit("receiveMessage", newMsg);
        io.to(sender).emit("receiveMessage", newMsg);

      } catch (err) {
        console.error("Message Error:", err.message);
      }
    });

    /* ======================
       LIKE EVENT
    ====================== */
    socket.on("likeUser", ({ toUser, fromUser }) => {
      if (!toUser) return;

      io.to(toUser).emit("newLike", {
        message: "❤️ Someone liked you!",
        fromUser,
      });
    });

    /* ======================
       MATCH EVENT
    ====================== */
    socket.on("matchFound", ({ toUser, fromUser }) => {
      if (!toUser || !fromUser) return;

      io.to(toUser).emit("matchAlert", {
        message: "🎉 It's a Match!",
        fromUser,
      });

      io.to(fromUser).emit("matchAlert", {
        message: "🎉 It's a Match!",
        fromUser: toUser,
      });
    });

    /* ======================
       DISCONNECT
    ====================== */
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }

      console.log("User disconnected:", socket.id);
    });
  });
};