import Job from '../models/Job.js'

// ─── GET ALL JOBS ─────────────────────────────────────────────────────────────
// GET /api/jobs
// Public: returns all visible jobs with company details
// Query params: title, location, level, jobType, minSalary, maxSalary
export const getAllJobs = async (req, res) => {
    try {
        const { title, location, level, jobType, minSalary, maxSalary } = req.query

        // Build dynamic filter object
        const filter = { visible: true }

        if (title) {
            filter.title = { $regex: title, $options: 'i' } // case-insensitive search
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' }
        }

        if (level) {
            filter.level = level
        }

        if (jobType) {
            filter.jobType = jobType
        }

        if (minSalary || maxSalary) {
            filter.salary = {}
            if (minSalary) filter.salary.$gte = Number(minSalary)
            if (maxSalary) filter.salary.$lte = Number(maxSalary)
        }

        const jobs = await Job.find(filter)
            .populate('companyId', 'name email image')
            .sort({ date: -1 })

        res.json({ success: true, jobs })
    } catch (error) {
        console.error('getAllJobs error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ─── GET SINGLE JOB ───────────────────────────────────────────────────────────
// GET /api/jobs/:id
// Public: returns full job details with company info
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('companyId', 'name email image')

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' })
        }

        res.json({ success: true, job })
    } catch (error) {
        console.error('getJobById error:', error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}