import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try{
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

export const login=(req,res)=>{
   try{

   }

   catch(error){

   }
}

export const logout=(req,res)=>{
    
}