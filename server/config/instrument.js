// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";


Sentry.init({
  dsn: "https://33cfed3c572f55dd98b69819bda20a84@o4511179025940481.ingest.us.sentry.io/4511179031052289",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  //sendDefaultPii: true,
  integrations: [Sentry.mongooseIntegration()],
});