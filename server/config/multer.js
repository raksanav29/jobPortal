
// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/")
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname)
//   }
// });

// const upload = multer({ storage });
// export default upload;

import multer from 'multer'

// Store in memory so we can stream directly to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'), false)
        }
    }
})

export default upload