// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     _id: {type:String , required:true},
//     name: {type:String , required: true},
//     email: {type:String , required: true , unique:true},
//     resume: {type:String},
//     image: {type:String , required: true}
// })

// const User = mongoose.model('User' , userSchema)

// export default User;

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        // Clerk's user ID — used to identify the user across requests
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // Profile image from Clerk or custom upload
        image: {
            type: String,
            default: '',
        },
        // Resume stored on Cloudinary
        resume: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User