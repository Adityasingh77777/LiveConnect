import jwt from "jsonwebtoken";

export const generateToken = (userId, res, req) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Determine if we're in production based on the request origin
  const isProduction = req?.headers?.origin?.includes('liveconnect.pages.dev') || 
                      process.env.NODE_ENV === "production";

  console.log("🍪 Generating token for user:", userId);
  console.log("🍪 Request origin:", req?.headers?.origin);
  console.log("🍪 NODE_ENV:", process.env.NODE_ENV);
  console.log("🍪 Is production:", isProduction);

  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "lax", // Changed from "strict" to "lax" to allow cross-origin requests
    secure: isProduction, // Set secure for production domains
    domain: isProduction ? ".liveconnect.pages.dev" : undefined, // Set domain for production
    path: "/", // Ensure cookie is available across the site
  };

  console.log("🍪 Cookie options:", cookieOptions);

  res.cookie("jwt", token, cookieOptions);
  
  console.log("🍪 Cookie set successfully");
  console.log("🍪 Response headers:", res.getHeaders());

  return token;
};