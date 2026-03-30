const router = require("express").Router();
const Match = require("../models/Match");


/* ======================
   GET MATCHES
====================== */

router.get("/matches", async (req, res) => {
  try {

    const matches = await Match.find({
      users: req.user.id,
      matched: true
    }).populate("users", "name email");

    res.json(matches);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }
});

module.exports = router;