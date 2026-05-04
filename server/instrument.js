import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import 'dotenv/config'

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    // Capture 100% of transactions in development, reduce in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
})

console.log('✅ Sentry initialized')