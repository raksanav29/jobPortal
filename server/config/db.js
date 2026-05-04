// import mongoose from 'mongoose'

// //function to connect to mongodb db
// const connectDB = async () => {
//     mongoose.connection.on('connected',()=>console.log('database connected'))
//     await mongoose.connect(`${process.env.MONGODB_URL}/job-portal`)
    
// }

// export default connectDB

import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully')
        })
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err)
        })
       await mongoose.connect(process.env.MONGODB_URL + '/jobPortal')
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message)
        process.exit(1)
    }
}

export default connectDB