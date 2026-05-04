
// import { Webhook } from "svix";
// import User from "../models/User.js";

// // API controller function to manage clerk user with database
// export const clerkWebhooks = async (req, res) => {
//   console.log("🔥 Webhook hit");

//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // ✅ verify using RAW body (important)
//     await whook.verify(req.body, {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     // ✅ convert raw buffer to JSON
//     const body = JSON.parse(req.body.toString());
//     const { data, type } = body;

//     console.log("Event:", type);

//     switch (type) {

//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           image: data.image_url,
//           resume: "",
//         };

//         await User.create(userData);
//         console.log("✅ User saved");

//         return res.status(200).json({ success: true });
//       }

//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           image: data.image_url,
//         };

//         await User.findByIdAndUpdate(data.id, userData);
//         console.log("✏️ User updated");

//         return res.status(200).json({ success: true });
//       }

//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         console.log("🗑️ User deleted");

//         return res.status(200).json({ success: true });
//       }

//       default:
//         return res.status(200).json({ message: "Event ignored" });
//     }

//   } catch (error) {
//     console.log("❌ ERROR:", error.message);
//     return res.status(500).json({ success: false, message: "Webhook error" });
//   }
// };


import { Webhook } from 'svix'
import User from '../models/User.js'

export const clerkWebhooks = async (req, res) => {
    try {
        // 1. Verify the webhook came from Clerk using svix signature
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        })

        const { data, type } = req.body

        // 2. Handle each event type
        switch (type) {
            case 'user.created': {
                const userData = {
                    clerkId: data.id,
                    name: `${data.first_name} ${data.last_name}`.trim(),
                    email: data.email_addresses[0].email_address,
                    image: data.image_url,
                    resume: '',
                }
                await User.create(userData)
                console.log(`✅ User created in DB: ${userData.email}`)
                break
            }

            case 'user.updated': {
                const userData = {
                    name: `${data.first_name} ${data.last_name}`.trim(),
                    email: data.email_addresses[0].email_address,
                    image: data.image_url,
                }
                await User.findOneAndUpdate({ clerkId: data.id }, userData)
                console.log(`✅ User updated in DB: ${userData.email}`)
                break
            }

            case 'user.deleted': {
                await User.findOneAndDelete({ clerkId: data.id })
                console.log(`✅ User deleted from DB: ${data.id}`)
                break
            }

            default:
                console.log(`Unhandled webhook event type: ${type}`)
        }

        res.status(200).json({ success: true, message: 'Webhook received' })
    } catch (error) {
        console.error('❌ Webhook error:', error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}