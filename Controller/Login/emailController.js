const User = require("../../Model/emailModel");
const Profile = require("../../Model/userModel");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const cryptr = new Cryptr(process.env.JWT_SECRET);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

exports.Signin = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email } = req.body;

  if (!email) {
    return res.status(200).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(200).json({ error: "Invalid email format" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        userId: new mongoose.Types.ObjectId(),
        loggedIn: false,
      });
    }

    if (user.loggedIn) {
      return res.status(200).json({ error: "User is already logged in" });
    }

    const otp = generateOTP();
    const encryptedOtp = cryptr.encrypt(otp);

    user.otp = encryptedOtp;
    user.loggedIn = false;
    await user.save();

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(200).json({ error: "Failed to send OTP email" });
      } else {
        res.status(201).json({
          success: true,
          message: "OTP sent to email",
          userId: user.userId,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to sign in" });
  }
};

// exports.verifyOTP = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(200).json({ error: "Email and OTP are required" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200).json({ error: "User not found" });
//     }

//     if (user.loggedIn) {
//       return res.status(200).json({ error: "User is already logged in" });
//     }

//     const decryptedOtp = cryptr.decrypt(user.otp);

//     if (decryptedOtp === otp) {
//       const sessionId = jwt.sign(
//         { sessionId: uuidv4(), email: user.email, userId: user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: "14m" }
//       );

//       const token = generateToken(user.email, user._id);

//       user.loggedIn = true;
//       user.otp = null;
//       user.token = token;
//       user.sessionId = sessionId;
//       await user.save();

//       const userProfile = await Profile.findOne({ userId: user._id });

//       res.status(201).json({
//         success: true,
//         message: "OTP is valid, user logged in",
//         token,
//         sessionId,
//         loggedIn: user.loggedIn,
//         userId: user._id,
//         userProfile: userProfile ? true : false,
//       });
//     } else {
//       res.status(200).json({ error: "Invalid OTP" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(200).json({ error: "Failed to verify OTP" });
//   }
// };

// exports.checkSession = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { token } = req.body;

//   if (!token) {
//     return res.status(200).json({ error: "Token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(200).json({ error: "User not found" });
//     }

//     if (user.loggedIn) {
//       return res.status(201).json({
//         success: true,
//         message: "Session is active",
//         sessionExpiresIn: decoded.exp - Math.floor(Date.now() / 1000),
//         userId: user._id,
//       });
//     } else {
//       return res.status(200).json({
//         error: "User is not logged in",
//       });
//     }
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(200).json({
//         error: "Session expired. Please log in again.",
//       });
//     } else {
//       console.error(err);
//       return res.status(200).json({
//         error: "Invalid session or token",
//       });
//     }
//   }
// };
exports.verifyOTP = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(200).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    if (user.loggedIn) {
      return res.status(200).json({ error: "User is already logged in" });
    }

    const decryptedOtp = cryptr.decrypt(user.otp);

    if (decryptedOtp === otp) {
      // Generate UUID for sessionId
      const sessionId = uuidv4();

      // Set session expiration time to 14 minutes from now
      const sessionExpiresAt = Date.now() + 14 * 60 * 1000; // 14 minutes in milliseconds

      // Generate JWT token with 15-minute expiration
      const token = generateToken(user.email, user._id);

      // Update user session information
      user.loggedIn = true;
      user.otp = null;
      user.token = token;
      user.sessionId = sessionId; // Store UUID sessionId
      user.sessionExpiresAt = sessionExpiresAt; // Store session expiration time
      await user.save();

      const userProfile = await Profile.findOne({ userId: user._id });

      res.status(201).json({
        success: true,
        message: "OTP is valid, user logged in",
        token,      // Return token (15 mins expiration)
        sessionId,  // Return UUID sessionId
        sessionExpiresAt, // Return the session expiration timestamp
        loggedIn: user.loggedIn,
        userId: user._id,
        userProfile: userProfile ? true : false,
      });
    } else {
      res.status(200).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to verify OTP" });
  }
};

exports.checkSession = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(200).json({ error: "Session ID is required" });
  }

  try {
    const user = await User.findOne({ sessionId });

    if (!user) {
      return res.status(200).json({ error: "Invalid session ID" });
    }

    // Check if session has expired
    if (Date.now() > user.sessionExpiresAt) {
      // Session expired
      user.loggedIn = false;
      user.sessionId = null;
      await user.save();
      return res.status(200).json({
        error: "Session has expired. Please log in again.",
      });
    }

    // Session is still valid
    return res.status(201).json({
      success: true,
      message: "Session is active",
      sessionExpiresIn: user.sessionExpiresAt - Date.now(), // Time remaining in milliseconds
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      error: "Failed to check session",
    });
  }
};

exports.refreshToken = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.email, decoded.userId);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.Validate = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(200).json({ error: "Email and token are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== email) {
      return res.status(200).json({ error: "Invalid token or email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    res.status(201).json({ success: true, message: "Valid email and token" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const user = await User.findOne({ email });

      if (user) {
        user.loggedIn = false;
        await user.save();
        return res
          .status(200)
          .json({ error: "Token expired. User has been logged out." });
      }
    } else {
      console.error(err);
      return res.status(200).json({ error: "Invalid token or email" });
    }
  }
};

exports.logout = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { userId } = req.body;

  if (!userId) {
    return res.status(200).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    user.loggedIn = false;
    user.sessionId = null;
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to log out" });
  }
};
