// const User = require("../../Model/emailModel");
// const Profile = require("../../Model/userModel");
// const nodemailer = require("nodemailer");
// const Cryptr = require("cryptr");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const cryptr = new Cryptr(process.env.JWT_SECRET);

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.APP_PASSWORD,
//   },
// });

// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const generateToken = (email, userId) => {
//   return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
//     expiresIn: "15m",
//   });
// };

// exports.Signin = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { email } = req.body;

//   if (!email) {
//     return res.status(200).json({ error: "Email is required" });
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(200).json({ error: "Invalid email format" });
//   }

//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       user = new User({
//         email,
//         userId: new mongoose.Types.ObjectId(),
//         loggedIn: false,
//       });
//     }

//     if (user.loggedIn) {
//       return res.status(200).json({ error: "User is already logged in" });
//     }

//     const otp = generateOTP();
//     const encryptedOtp = cryptr.encrypt(otp);

//     user.otp = encryptedOtp;
//     user.loggedIn = false;
//     await user.save();

//     const mailOptions = {
//       from: process.env.USER,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP code is: ${otp}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         return res.status(200).json({ error: "Failed to send OTP email" });
//       } else {
//         res.status(201).json({
//           success: true,
//           message: "OTP sent to email",
//           userId: user.userId,
//         });
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(200).json({ error: "Failed to sign in" });
//   }
// };

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
//         { email: user.email, userId: user._id },
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
//         sessionExpiresIn: 14 * 60,
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

// // Refresh token
// exports.refreshToken = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ error: "Token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const newToken = generateToken(decoded.email, decoded.userId);

//     res.json({
//       success: true,
//       message: "Token refreshed successfully",
//       token: newToken,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// exports.Validate = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { email, token } = req.body;

//   if (!email || !token) {
//     return res.status(200).json({ error: "Email and token are required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.email !== email) {
//       return res.status(200).json({ error: "Invalid token or email" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200).json({ error: "User not found" });
//     }

//     res.status(201).json({ success: true, message: "Valid email and token" });
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       const user = await User.findOne({ email });

//       if (user) {
//         user.loggedIn = false;
//         await user.save();
//         return res
//           .status(200)
//           .json({ error: "Token expired. User has been logged out." });
//       }
//     } else {
//       console.error(err);
//       return res.status(200).json({ error: "Invalid token or email" });
//     }
//   }
// };

// exports.logout = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(200).json({ error: "User ID is required" });
//   }

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(200).json({ error: "User not found" });
//     }

//     user.loggedIn = false;
//     await user.save();
//     res
//       .status(201)
//       .json({ success: true, message: "User logged out successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(200).json({ error: "Failed to log out" });
//   }
// };

const User = require("../../Model/emailModel");
const Profile = require("../../Model/userModel");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const cryptr = new Cryptr(process.env.JWT_SECRET);

// Email Transporter Configuration
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

// Function to Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to Generate Access Token (Short-lived)
const generateAccessToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Function to Generate Refresh Token (Long-lived)
const generateRefreshToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "15m",
  });
};

// Signin or OTP Generation Function
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

// OTP Verification Function
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
      const accessToken = generateAccessToken(user.email, user._id);
      const refreshToken = generateRefreshToken(user.email, user._id);

      user.loggedIn = true;
      user.otp = null;
      user.refreshToken = refreshToken; // Save refresh token in DB
      await user.save();

      res.status(201).json({
        success: true,
        message: "OTP is valid, user logged in",
        accessToken,
        refreshToken,
      });
    } else {
      res.status(200).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to verify OTP" });
  }
};

// Check Session Function
exports.checkSession = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { token } = req.body;

  if (!token) {
    return res.status(200).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    if (user.loggedIn) {
      return res.status(201).json({
        success: true,
        message: "Session is active",
        sessionExpiresIn: decoded.exp - Math.floor(Date.now() / 1000),
        userId: user._id,
      });
    } else {
      return res.status(200).json({
        error: "User is not logged in",
      });
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(200).json({
        error: "Session expired. Please log in again.",
      });
    } else {
      console.error(err);
      return res.status(200).json({
        error: "Invalid session or token",
      });
    }
  }
};

// Refresh Token Function
exports.refreshToken = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if the refresh token matches with the stored token in the database
    const user = await User.findOne({ _id: decoded.userId, refreshToken });

    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user.email, user._id);

    res.status(201).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// Validate Email and Token Function
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

// Logout Function
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
    user.refreshToken = null; // Invalidate refresh token
    await user.save();

    res.status(201).json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to log out" });
  }
};
