// controllers/matchController.js
import Match from "../models/Match.js";
import Like from "../models/Like.js";

export const likeUser = async (req, res) => {
  const { likedBy, likedTo } = req.body;

  await Like.create({ likedBy, likedTo });

  // 🔥 check reverse like
  const match = await Like.findOne({
    likedBy: likedTo,
    likedTo: likedBy,
  });

  if (match) {
    const newMatch = await Match.create({
      users: [likedBy, likedTo],
    });

    return res.json({ match: true, matchId: newMatch._id });
  }

  res.json({ match: false });
};