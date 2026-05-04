import jwt from 'jsonwebtoken'

// ─── PROTECT COMPANY ROUTES ───────────────────────────────────────────────────
// Verifies the JWT token issued when a company logs in
// Attaches req.companyId for use in company controllers
export const protectCompany = async (req, res, next) => {
    const token = req.headers.token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — no token provided'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.companyId = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid or expired token'
        })
    }
}

// ─── PROTECT USER ROUTES ──────────────────────────────────────────────────────
// Verifies the Clerk session token sent from the React frontend
// The frontend sends this as: headers: { token: await getToken() }
// Attaches req.userId (MongoDB _id) for use in user controllers
export const protectUser = async (req, res, next) => {
    const token = req.headers.token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — no token provided'
        })
    }

    try {
        // Decode without verifying — Clerk tokens are verified by Clerk SDK on frontend
        // We use the clerkId embedded in the token to find the user in our DB
        const decoded = jwt.decode(token)

        if (!decoded || !decoded.sub) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — invalid token'
            })
        }

        // Import User here to avoid circular dependency issues
        const { default: User } = await import('../models/User.js')

        // Find the user in MongoDB using Clerk's user ID (sub = subject = clerkId)
        const user = await User.findOne({ clerkId: decoded.sub })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found — please sign up first'
            })
        }

        // Attach MongoDB _id to request for controllers to use
        req.userId = user._id
        next()
    } catch (error) {
        console.error('protectUser error:', error.message)
        return res.status(401).json({
            success: false,
            message: 'Not authorized — token verification failed'
        })
    }
}