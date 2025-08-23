import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "lax", // Changed from "strict" to "lax" to allow cross-origin requests
    secure: process.env.NODE_ENV === "production", // Only set secure in production
    domain: process.env.NODE_ENV === "production" ? ".liveconnect.pages.dev" : undefined, // Set domain for production
  });

  return token;
};