const jwt = require("jsonwebtoken");
const User = require("../Model/emailModel");

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if token is expired
      if (Date.now() >= decoded.exp * 1000) {
        const user = await User.findById(decoded.userId);
        if (user && user.loggedIn) {
          user.loggedIn = false;
          await user.save();
        }
        return res.status(401).json({ error: "Session expired, please log in again" });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
  
module.exports = verifyToken;
