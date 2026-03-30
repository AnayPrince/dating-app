import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // ✅ MUST SAME

    req.user = verified;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); // 👈 DEBUG
    return res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;