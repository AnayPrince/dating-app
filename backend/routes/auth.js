// const router = require("express").Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// /* ======================
//    REGISTER
// ====================== */

// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "User registered",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Server error",
//       error: err.message,
//     });
//   }
// });

// /* ======================
//    LOGIN
// ====================== */

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password required",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "User not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid password",
//       });
//     }

//     const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1d" });

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Server error",
//       error: err.message,
//     });
//   }
// });

// module.exports = router;

// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import speakeasy from "speakeasy";
// import QRCode from "qrcode";

// import User from "../models/User.js";

// const router = express.Router();

// /* ======================
//    REGISTER
// ====================== */
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.json({
//       message: "User registered",
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /* ======================
//    LOGIN
// ====================== */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password, token } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     // 🔐 2FA CHECK
// if (user.twoFactorEnabled) {
//   if (!token) {
//     return res.json({
//       require2FA: true,
//       userId: user._id, // 🔥 IMPORTANT
//     });
//   }

//   const verified = speakeasy.totp.verify({
//     secret: user.twoFactorSecret,
//     encoding: "base32",
//     token,
//   });

//   if (!verified) {
//     return res.status(400).json({
//       message: "Invalid OTP",
//     });
//   }
// }

//     // ✅ FINAL LOGIN
//     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.json({
//       token: jwtToken,
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /* ======================
//    ENABLE 2FA
// ====================== */
// router.post("/enable-2fa", async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({
//         message: "User ID required",
//       });
//     }

//     const secret = speakeasy.generateSecret({
//       length: 20,
//     });

//     // 🔥 IMPORTANT: USE $set
//     await User.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           twoFactorSecret: secret.base32,
//           twoFactorEnabled: true, // 🔥 MUST
//         },
//       },
//       { new: true }
//     );

//     const qr = await QRCode.toDataURL(secret.otpauth_url);

//     res.json({
//       qr,
//       message: "2FA enabled",
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "2FA setup failed",
//     });
//   }
// });

// export default router;


import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../models/User.js";

const router = express.Router();

/* ======================
   REGISTER
====================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.json({
      message: "User registered",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // ✅ token yahan nahi lena

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // 🔐 2FA enabled hai to OTP screen dikhao
    if (user.twoFactorEnabled) {
      return res.json({
        require2FA: true,
        userId: user._id, // ✅ frontend ko chahiye verify ke liye
      });
    }

    // ✅ Normal login - JWT do
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================
   VERIFY 2FA  ✅ NAYA ROUTE
====================== */
router.post("/verify-2fa", async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: "userId and token required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    // ✅ OTP verify karo
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1, // ✅ 30sec window - timing issues fix
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    // ✅ JWT do
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token: jwtToken,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================
   ENABLE 2FA
====================== */
router.post("/enable-2fa", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const secret = speakeasy.generateSecret({ length: 20 });

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          twoFactorSecret: secret.base32,
          twoFactorEnabled: true,
        },
      },
      { new: true }
    );

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    res.json({ qr, message: "2FA enabled" });
  } catch (err) {
    res.status(500).json({ message: "2FA setup failed" });
  }
});

export default router;