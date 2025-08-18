import express from "express"
import {protectRoute} from "../middlewares/auth.middlewares.js"
import {login,signup,logout,updateProfile} from "../controllers/auth.controller.js"
const router=express.Router();

router.post("/signup",signup)

router.post("/login",login);

router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile);

export default router;