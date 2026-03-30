const router = require("express").Router();

router.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false, 
      }),
    });

    const data = await response.json();

    res.json({
      message: response.data.response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "AI error" });
  }
});

module.exports = router;
