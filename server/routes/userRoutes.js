import express from 'express'
import {
    applyForJob,
    getUserApplications,
    getUserData,
    updateUserResume,
} from '../controllers/userController.js'
import { protectUser } from '../middleware/authMiddleware.js'
import upload from '../config/multer.js'

const router = express.Router()

// All user routes require Clerk authentication
router.get('/user', protectUser, getUserData)
router.post('/apply', protectUser, applyForJob)
router.get('/applications', protectUser, getUserApplications)
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume)

export default router