import mongoose from "mongoose";
const jobSchema = new mongoose.schema({
    title : {type : String,required:true}
})