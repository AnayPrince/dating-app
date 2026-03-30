// controllers/messageController.js
import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const { userId, chatUserId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: chatUserId },
      { sender: chatUserId, receiver: userId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
};