// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js'
// import { clerkWebhooks } from './controllers/webhooks.js'
// import companyRoutes from './routes/companyRoutes.js'
// import connectCloudinary from './config/cloudinary.js'

// // initialize express
// const app = express()

// // connect DB & cloudinary
// await connectDB()
// await connectCloudinary()

// // ✅ middleware
// app.use(cors())

// // ❗ webhook needs raw body
// app.use('/webhooks', express.raw({ type: 'application/json' }))

// // ❗ IMPORTANT: NO express.json BEFORE multer routes

// // ✅ company routes (multer runs here FIRST)
// app.use('/api/company', companyRoutes)

// // ✅ JSON AFTER routes (safe)
// app.use(express.json())

// // routes
// app.get('/', (req, res) => res.send("API Working"))
// app.post('/webhooks', clerkWebhooks)

// // port
// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`)
// })

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'

const app = express()

await connectDB()
await connectCloudinary()

// ✅ middleware
app.use(cors())

// ❗ webhook needs raw body
app.use('/webhooks', express.raw({ type: 'application/json' }))

// ✅ FIX: JSON must come BEFORE routes
app.use(express.json())

// routes
app.use('/api/company', companyRoutes)

app.get('/', (req, res) => res.send("API Working"))
app.post('/webhooks', clerkWebhooks)

// port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})