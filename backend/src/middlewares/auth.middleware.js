import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("🔐 Auth middleware triggered for:", req.path);
    console.log("🔐 Request headers:", {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      'user-agent': req.headers['user-agent']
    });
    console.log("🔐 All cookies received:", req.cookies);
    console.log("🔐 Raw cookie header:", req.headers.cookie);
    
    const token = req.cookies.jwt;
    
    console.log("🔐 Auth middleware - Cookies received:", req.cookies);
    console.log("🔐 Auth middleware - JWT token:", token ? "Present" : "Missing");

    if (!token) {
      console.log("❌ No JWT token found in cookies");
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ JWT token verified for user:", decoded.userId);
      
      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
      }

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        console.log("❌ User not found for ID:", decoded.userId);
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      console.log("✅ User authenticated:", user.email);
      next();
    } catch (jwtError) {
      console.log("❌ JWT verification failed:", jwtError.message);
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
  } catch (error) {
    console.log("❌ Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};