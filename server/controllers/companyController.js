
// import Company from "../models/Company.js";
// import bcrypt from 'bcrypt';
// import { v2 as cloudinary } from 'cloudinary';
// import generateToken from "../utils/generateToken.js";

// // ✅ register a new company
// export const registerCompany = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const imageFile = req.file;


//     if (!name || !email || !password || !imageFile) {
//       return res.json({ success: false, message: "Missing details" });
//     }

//     const companyExists = await Company.findOne({ email });

//     if (companyExists) {
//       return res.json({ success: false, message: "Company already registered" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//    const imageUpload = await cloudinary.uploader.upload(imageFile.path.replace(/\\/g, '/'));
// //    const imageUpload = await new Promise((resolve, reject) => {
// //   cloudinary.uploader.upload_stream(
// //     { resource_type: "image" },
// //     (error, result) => {
// //       if (error) reject(error);
// //       else resolve(result);
// //     }
// //   ).end(imageFile.buffer);  // ← use .buffer not .path
// // });



//     const company = await Company.create({
//       name,
//       email,
//       password: hashPassword,
//       image: imageUpload.secure_url
//     });

//     res.json({
//       success: true,
//       company: {
//         _id: company._id,
//         name: company.name,
//         email: company.email,
//         image: company.image
//       },
//       token: generateToken(company._id)
//     });

//   } catch (error) {








//  console.log("FULL ERROR:", JSON.stringify(error, null, 2))









//     res.json({ success: false, message: error.message });
//   }
// };


// // company login
// export const loginCompany = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const company = await Company.findOne({ email });

//     if (company && await bcrypt.compare(password, company.password)) {
//       res.json({
//         success: true,
//         company: {
//           _id: company._id,
//           name: company.name,
//           email: company.email,
//           image: company.image
//         },
//         token: generateToken(company._id)
//       });
//     } else {
//       res.json({ success: false, message: 'invalid email or password' });
//     }

//   } catch (error) {   // ✅ now correct
//     res.json({ success: false, message: error.message });
//   }
// };


// // get company data
// export const getCompanyData = async (req, res) => {
//   res.json({ message: "company data API" });
// };

// // post job
// export const postJob = async (req, res) => {
//   res.json({ message: "post job API" });
// };

// // applicants
// export const getCompanyJobApplicants = async (req, res) => {
//   res.json({ message: "applicants API" });
// };

// // job list
// export const getCompanyPostedJobs = async (req, res) => {
//   res.json({ message: "jobs list API" });
// };

// // change status
// export const ChangeJobApplicationStatus = async (req, res) => {
//   res.json({ message: "status updated" });
// };

// // change visibility
// export const changeVisibility = async (req, res) => {
//   res.json({ message: "visibility changed" });
// };

import Company from '../models/Company.js'
import Job from '../models/Job.js'
import JobApplication from '../models/JobApplication.js'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'
import { v2 as cloudinary } from 'cloudinary'

// ─── REGISTER COMPANY ────────────────────────────────────────────────────────
// POST /api/company/register
// Body: { name, email, password } | File: image (via multer)
export const registerCompany = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if company already exists
        const existingCompany = await Company.findOne({ email })
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: 'Company already registered with this email'
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Upload logo to Cloudinary from memory buffer
        let imageUrl = ''
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'job_portal/companies' },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            imageUrl = result.secure_url
        }

        // Create company
        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
        })

        // Return token so company is immediately logged in
        const token = generateToken(company._id)

        res.status(201).json({
            success: true,
            message: 'Company registered successfully',
            token,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
        })
    } catch (error) {
        console.error('registerCompany error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── LOGIN COMPANY ────────────────────────────────────────────────────────────
// POST /api/company/login
// Body: { email, password }
export const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body

        const company = await Company.findOne({ email })
        if (!company) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, company.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = generateToken(company._id)

        res.json({
            success: true,
            token,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
        })
    } catch (error) {
        console.error('loginCompany error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── GET COMPANY DATA ─────────────────────────────────────────────────────────
// GET /api/company/company
// Protected: requires companyId from auth middleware
export const getCompanyData = async (req, res) => {
    try {
        const company = await Company.findById(req.companyId).select('-password')
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' })
        }
        res.json({ success: true, company })
    } catch (error) {
        console.error('getCompanyData error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── POST A JOB ───────────────────────────────────────────────────────────────
// POST /api/company/post-job
// Protected: requires companyId from auth middleware
// Body: { title, description, location, jobType, level, salary }
export const postJob = async (req, res) => {
    try {
        const { title, description, location, jobType, level, salary } = req.body

        const job = await Job.create({
            companyId: req.companyId,
            title,
            description,
            location,
            jobType,
            level,
            salary: Number(salary),
            date: Date.now(),
        })

        res.status(201).json({ success: true, message: 'Job posted successfully', job })
    } catch (error) {
        console.error('postJob error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── GET COMPANY JOB APPLICANTS ───────────────────────────────────────────────
// GET /api/company/applicants
// Protected: returns all applications for all jobs posted by this company
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const applications = await JobApplication.find({ companyId: req.companyId })
            .populate('userId', 'name email image resume')
            .populate('jobId', 'title location jobType')
            .sort({ date: -1 })

        res.json({ success: true, applications })
    } catch (error) {
        console.error('getCompanyJobApplicants error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── GET COMPANY POSTED JOBS ──────────────────────────────────────────────────
// GET /api/company/list-jobs
// Protected: returns all jobs posted by this company with applicant counts
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.companyId }).sort({ date: -1 })

        // Add applicant count to each job
        const jobsWithApplicants = await Promise.all(
            jobs.map(async (job) => {
                const applicantCount = await JobApplication.countDocuments({ jobId: job._id })
                return { ...job.toObject(), applicants: applicantCount }
            })
        )

        res.json({ success: true, jobs: jobsWithApplicants })
    } catch (error) {
        console.error('getCompanyPostedJobs error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── CHANGE APPLICATION STATUS ────────────────────────────────────────────────
// POST /api/company/change-status
// Protected: Body: { applicationId, status }
// status must be one of: Pending, Reviewed, Accepted, Rejected
export const ChangeJobApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body

        const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            })
        }

        const application = await JobApplication.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        )

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' })
        }

        res.json({ success: true, message: 'Application status updated', application })
    } catch (error) {
        console.error('ChangeJobApplicationStatus error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── CHANGE JOB VISIBILITY ────────────────────────────────────────────────────
// POST /api/company/change-visibility
// Protected: Body: { jobId }
// Toggles the visible field on the job
export const changeVisibility = async (req, res) => {
    try {
        const { jobId } = req.body

        // Ensure the job belongs to this company
        const job = await Job.findOne({ _id: jobId, companyId: req.companyId })
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or unauthorized'
            })
        }

        job.visible = !job.visible
        await job.save()

        res.json({
            success: true,
            message: `Job is now ${job.visible ? 'visible' : 'hidden'}`,
            job,
        })
    } catch (error) {
        console.error('changeVisibility error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}