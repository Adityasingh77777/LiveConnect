import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,                // Stores the current authenticated user (null if not logged in)
    isSigningUp: false,            // Tracks if a signup request is in progress
    isLoggingIn: false,            // Tracks if a login request is in progress
    isUpdatingProfile: false,      // Tracks if a profile update is in progress
    isCheckingAuth: true,          // Tracks if the app is checking if the user is authenticated

    checkAuth: async () => {       // Function to check if the user is authenticated
        try {
            const res = await axiosInstance.get("/auth/check"); // Calls backend to check auth
            set({ authUser: res.data });                        // Sets the user data if authenticated
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });                            // Sets user to null if not authenticated
        } finally {
            set({ isCheckingAuth: false });                     // Marks that auth check is done
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },

    login:async(data) =>{
        set({isLoggingIn :true});
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in Successfully")
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully")
        }catch(error){
            toast.error(error.message.data.message);
        }
    }
}));