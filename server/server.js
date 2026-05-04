// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js'
// import { clerkWebhooks } from './controllers/webhooks.js'
// import companyRoutes from './routes/companyRoutes.js'
// import connectCloudinary from './config/cloudinary.js'

// const app = express()

// await connectDB()
// await connectCloudinary()

// // ✅ middleware
// app.use(cors())

// // ❗ webhook needs raw body
// app.use('/webhooks', express.raw({ type: 'application/json' }))

// // ✅ FIX: JSON must come BEFORE routes
// app.use(express.json())

// // routes
// app.use('/api/company', companyRoutes)

// app.get('/', (req, res) => res.send("API Working"))
// app.post('/webhooks', clerkWebhooks)

// // port
// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`)
// })



import './instrument.js' // Sentry MUST be imported first
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import * as Sentry from '@sentry/node'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'

// Initialize express
const app = express()

// Connect DB & Cloudinary
await connectDB()
await connectCloudinary()

// Middleware
app.use(cors())

// ⚠️ Webhook route MUST use raw body parser (before express.json)
app.use('/api/webhooks', webhookRoutes)

// Standard JSON parser for all other routes
app.use(express.json())

// Routes
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/', (req, res) => {
    res.send('Job Portal API is running ✅')
})

// Sentry error handler (must be after routes)
Sentry.setupExpressErrorHandler(app)

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})