// import { Webhook } from "svix";
// import User from "../models/User.js";

// //API controller function to manage clerk user with database
// export const clerkWebhooks = async (req, res) => {
//   try {
//     // CREATE a svix instance with clerk webhook secret.
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // verifying headers
//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     //getting data from request body
//     const { data, type } = req.body;

//     //switch cases for different events
//     switch (type) {
//       case "user.created": {

//         const userData = {
//             _id:data.id ,
//             email : data.email_addresses[0].email_address,
//             name : data.first_name + " " + data.last_name,
//             image : data.image_url,
//             resume : ''
//         }
//         await User.create(userData)
//         res.json({}) 
//         break ;

//       }

//       case "user.updated": {

//         const userData = {
//             email : data.email_addresses[0].email_address,
//             name : data.first_name + " " + data.last_name,
//             image : data.image_url,
//       }
//       await User.findByIdAndUpdate(data.id , userData)
//       res.json({})
//       break;
//     }

//       case "user.deleted": {
//          await User.findByIdAndDelete(data.id)
//          res.json({})
//          break;
//       }
//       default:
//         break;
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.json({success:false , message :'webhooks error'})
     

//   }
// };
import { Webhook } from "svix";
import User from "../models/User.js";

// API controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  console.log("🔥 Webhook hit");

  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ verify using RAW body (important)
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // ✅ convert raw buffer to JSON
    const body = JSON.parse(req.body.toString());
    const { data, type } = body;

    console.log("Event:", type);

    switch (type) {

      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };

        await User.create(userData);
        console.log("✅ User saved");

        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        console.log("✏️ User updated");

        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted");

        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ message: "Event ignored" });
    }

  } catch (error) {
    console.log("❌ ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Webhook error" });
  }
};