import User from '../models/User.js'
import Job from '../models/Job.js'
import JobApplication from '../models/JobApplication.js'
import { v2 as cloudinary } from 'cloudinary'

// ─── GET USER DATA ────────────────────────────────────────────────────────────
// GET /api/users/user
// Protected (Clerk): returns logged-in user's profile
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.error('getUserData error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── APPLY FOR JOB ────────────────────────────────────────────────────────────
// POST /api/users/apply
// Protected (Clerk): Body: { jobId }
// Uses the resume already saved on the user's profile
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body
        const userId = req.userId

        // Validate the job exists
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' })
        }

        // Check if user already applied
        const existingApplication = await JobApplication.findOne({ userId, jobId })
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            })
        }

        // Get user's saved resume
        const user = await User.findById(userId)
        if (!user || !user.resume) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a resume before applying'
            })
        }

        // Create the application
        const application = await JobApplication.create({
            userId,
            jobId,
            companyId: job.companyId,
            resume: user.resume,
            date: Date.now(),
        })

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application,
        })
    } catch (error) {
        // Catch MongoDB duplicate key error as a fallback
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            })
        }
        console.error('applyForJob error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── GET USER APPLICATIONS ────────────────────────────────────────────────────
// GET /api/users/applications
// Protected (Clerk): returns all jobs this user has applied to
export const getUserApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ userId: req.userId })
            .populate({
                path: 'jobId',
                populate: {
                    path: 'companyId',
                    select: 'name image',
                },
            })
            .sort({ date: -1 })

        res.json({ success: true, applications })
    } catch (error) {
        console.error('getUserApplications error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── UPDATE USER RESUME ───────────────────────────────────────────────────────
// POST /api/users/update-resume
// Protected (Clerk): File: resume (via multer)
// Uploads PDF resume to Cloudinary and saves URL to user profile
export const updateUserResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' })
        }

        // Upload to Cloudinary — raw resource type for PDFs
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'job_portal/resumes',
                    resource_type: 'raw', // required for PDF files
                    format: 'pdf',
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            stream.end(req.file.buffer)
        })

        // Save Cloudinary URL to user document
        const user = await User.findByIdAndUpdate(
            req.userId,
            { resume: result.secure_url },
            { new: true }
        )

        res.json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeUrl: user.resume,
        })
    } catch (error) {
        console.error('updateUserResume error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}