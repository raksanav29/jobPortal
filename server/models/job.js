// import mongoose from "mongoose";
// const jobSchema = new mongoose.schema({
//     title : {type : String,required:true}
// })

import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
    {
        // Reference to the company that posted this job
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        // HTML string from Quill rich text editor
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        // e.g. "Full-time", "Part-time", "Contract", "Internship"
        jobType: {
            type: String,
            required: true,
        },
        // e.g. "Entry Level", "Mid Level", "Senior Level"
        level: {
            type: String,
            required: true,
        },
        // Annual salary in USD (number for easy sorting/filtering)
        salary: {
            type: Number,
            required: true,
        },
        // Number of applicants — updated when someone applies
        applicants: {
            type: Number,
            default: 0,
        },
        // Hidden jobs don't show in public listing
        visible: {
            type: Boolean,
            default: true,
        },
        // Date the job was posted (for "posted X days ago" display)
        date: {
            type: Number,
            default: () => Date.now(),
        },
    },
    { timestamps: true }
)

const Job = mongoose.model('Job', jobSchema)
export default Job