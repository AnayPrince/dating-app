// import express from "express";
// import Message from "../models/Message.js";

// const router = express.Router();

// // router.get("/messages/:matchId", async (req, res) => {
// //   try {
// //     const messages = await Message.find({
// //       matchId: req.params.matchId,
// //     });

// //     res.json(messages);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error fetching messages" });
// //   }
// // });

// // messageRoutes.js
// router.get("/messages/:matchId", async (req, res) => {
//   const messages = await Message.find({
//     matchId: req.params.matchId,
//   }).sort({ createdAt: 1 });

//   res.json(messages);
// });


// router.post("/messages", async (req, res) => {
//   try {
//     const { sender, receiver, message } = req.body;

//     const newMessage = new Message({
//       sender,
//       receiver,
//       message,
//       matchId: [sender, receiver].sort().join("_"),
//     });

//     await newMessage.save();

//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ message: "Error saving message" });
//   }
// });

// export default router;.


import express from "express";
import Message from "../models/Message.js";
import CryptoJS from "crypto-js";

const router = express.Router();

const SECRET_KEY = "mySuperSecureKey123";

/* ======================
   📥 GET MESSAGES
====================== */
router.get("/messages/:matchId", async (req, res) => {
  try {
    const messages = await Message.find({
      matchId: req.params.matchId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

/* ======================
   📤 SEND MESSAGE
====================== */
router.post("/messages", async (req, res) => {
  try {
    let { sender, receiver, message } = req.body;

    // ❌ validation
    if (!sender || !receiver || !message) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // 🔐 ENCRYPT MESSAGE
    const encryptedMessage = CryptoJS.AES.encrypt(
      message,
      SECRET_KEY
    ).toString();

    let expiresAt = null;

    // 🧨 SELF DESTRUCT (ONLY IMAGE)
    if (typeof message === "string" && message.startsWith("http")) {
      expiresAt = new Date(Date.now() + 10 * 1000); // 10 sec
    }

    const newMessage = new Message({
      sender,
      receiver,
      message: encryptedMessage, // 🔐 encrypted
      expiresAt,
      matchId: [sender, receiver].sort().join("_"),
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: "Error saving message" });
  }
});

export default router;