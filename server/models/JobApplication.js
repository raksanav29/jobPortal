import mongoose from 'mongoose'

const jobApplicationSchema = new mongoose.Schema(
    {
        // The job seeker who applied
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // The job they applied to
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        // The company that posted the job (denormalized for faster queries)
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        // Cloudinary URL of the resume submitted with this application
        resume: {
            type: String,
            default: '',
        },
        // Employer updates this as they review applications
        status: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
            default: 'Pending',
        },
        // Date applied — stored as timestamp number (matches Job.date pattern)
        date: {
            type: Number,
            default: () => Date.now(),
        },
    },
    { timestamps: true }
)

// Prevent a user from applying to the same job twice
jobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true })

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema)
export default JobApplication