import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected Successfully: ${conn.connection.host}`)
    }
    catch(error){
        console.log("Database Connection Failed")
    }
}