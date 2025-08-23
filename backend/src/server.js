import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5003;
const NODE_ENV = process.env.NODE_ENV || "development";

// Log environment for debugging
console.log("🌍 Environment:", NODE_ENV);
console.log("🔧 Port:", PORT);

app.use(express.json());
app.use(cookieParser());

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = NODE_ENV === "development" 
      ? ["http://localhost:5173", "http://localhost:3000"]
      : ["https://liveconnect.pages.dev", "https://liveconnect-0wp5.onrender.com"];
    
    console.log("🌐 CORS check - Origin:", origin, "Allowed:", allowedOrigins.includes(origin));
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

// Add middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Test endpoint for debugging cookies
app.get("/api/test-cookies", (req, res) => {
  console.log("🧪 Test cookies endpoint hit");
  console.log("🧪 Request origin:", req.headers.origin);
  console.log("🧪 Request cookies:", req.cookies);
  console.log("🧪 Raw cookie header:", req.headers.cookie);
  
  // Set a test cookie
  res.cookie("testCookie", "testValue", {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: req.headers.origin?.includes('liveconnect.pages.dev'),
    domain: req.headers.origin?.includes('liveconnect.pages.dev') ? ".liveconnect.pages.dev" : undefined,
    path: "/",
  });
  
  res.json({ 
    message: "Test cookie set", 
    cookies: req.cookies,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT: ${PORT} in ${NODE_ENV} mode`);
  console.log("🔒 CORS enabled for origins:", NODE_ENV === "development" 
    ? ["http://localhost:5173", "http://localhost:3000"]
    : ["https://liveconnect.pages.dev", "https://liveconnect-0wp5.onrender.com"]);
  connectDB();
});