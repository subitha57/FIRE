const User = require("../../Model/emailModel");
const Profile = require("../../Model/userModel");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
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

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token with 1-minute expiration
const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "1m", // Token expires in 1 minute
  });
};

// Signin Controller
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

// Verify OTP Controller
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
      const token = generateToken(user.email, user._id);

      user.loggedIn = true;
      user.otp = null;
      user.token = token;
      await user.save();

      const userProfile = await Profile.findOne({ userId: user._id });

      res.status(201).json({
        success: true,
        message: "OTP is valid, user logged in",
        token,
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

// Validate Token Controller
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
      // If token is expired, log out the user by setting loggedIn to false
      const user = await User.findOne({ email });

      if (user) {
        user.loggedIn = false;
        await user.save();
        return res.status(200).json({ error: "Token expired. User has been logged out." });
      }
    } else {
      console.error(err);
      return res.status(200).json({ error: "Invalid token or email" });
    }
  }
};

// Logout Controller
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
    await user.save();
    res.status(201).json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to log out" });
  }
};
