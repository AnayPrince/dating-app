import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Like from "../models/Like.js";
import Match from "../models/Match.js";

const router = express.Router();

/* ======================
   LIKE USER
====================== */
router.post("/like", authMiddleware, async (req, res) => {
  try {

    const fromUser = req.user.id;
    const { toUser } = req.body;

    // ❌ prevent self like
    if (fromUser === toUser) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // ❌ prevent duplicate like
    const alreadyLiked = await Like.findOne({
      fromUser,
      toUser
    });

    if (alreadyLiked) {
      return res.json({ match: false, message: "Already liked" });
    }

    // ✅ save like
    await Like.create({
      fromUser,
      toUser
    });

    // ✅ check reverse like
    const reverse = await Like.findOne({
      fromUser: toUser,
      toUser: fromUser
    });

    if (reverse) {

      // 🔥 check if match already exists
      let match = await Match.findOne({
        users: { $all: [fromUser, toUser] }
      });

      if (!match) {
        match = await Match.create({
          users: [fromUser, toUser],
          matched: true
        });
      } else {
        match.matched = true;
        await match.save();
      }

      return res.json({
        match: true,
        matchData: match
      });
    }

    return res.json({
      match: false
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

export default router; // 🔥 IMPORTANT