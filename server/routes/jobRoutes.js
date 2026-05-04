import express from 'express'
import { getAllJobs, getJobById } from '../controllers/jobController.js'

const router = express.Router()

// ── Public routes (no auth needed) ──────────────────────────────
router.get('/', getAllJobs)
router.get('/:id', getJobById)

export default router