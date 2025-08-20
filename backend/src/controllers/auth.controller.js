import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!fullName || !email || !password) {
            return res.status(400).json({
                message:"All field are required"
            })
        }
        if(password.length < 6) {
            return res.status(400).json({
                message:"Password must be atleast 6 characters"
            })
        }

        const user=await User.findOne({email});

        if(user) return res.status(400).josn({
            message:"Email already exists"
        })

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            // generate jwt token
             generateToken(newUser._id,res);
             await newUser.save()

             res.status(200).json({
                _id:newUser._id,
                message:"user created Successfully",
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
             });
        }

        else{
            return res.status(400).json({
                message:"Invalid user credentials"
            })
        }
    }
    
    catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({
            message:"Registration failed"
        })
    }
};

export const login=async(req,res)=>{
   const {email,password} = req.body;

   try{
    if(!email || !password) return res.status(400).json({message:"All fields are required"})

    const user=await User.findOne({email});

    if(!user) return res.status(400).json({message:"Invalid email or password"})

    const isPasswordCheck=await bcrypt.compare(password,user.password);
    if(!isPasswordCheck) return res.status(400).json({message:"Invalid email or password"});

    generateToken(user._id,res);

    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
    });
   }
   catch(error){
    console.log(error.message);
    return res.status(500).json({
        message:"Login Failed"
    })
   }
}

export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            message:"Logged Out Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Logged out Failed"
        })
    }
}


export const updateProfile=async(req,res)=>{
    
    try{
        const{profilePic}= req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message:"Profile Pic is mandatory"
            })
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);

        const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.send(200).json({
            message:"Profile pic updated"
        })

    }
    catch(error){
        return res.status(500).json({
            message:"Profile is not Updated"
        })
    }
}

export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in CheckAuth Controller",error.message);
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}