import express from 'express'
import { clerkWebhooks } from '../controllers/webhooks.js'

const router = express.Router()

// Raw body parser REQUIRED for svix signature verification
// express.json() would parse the body and break signature checks
router.post(
    '/clerk',
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
        // Convert raw Buffer back to parsed object for our controller
        req.body = JSON.parse(req.body)
        next()
    },
    clerkWebhooks
)

export default router