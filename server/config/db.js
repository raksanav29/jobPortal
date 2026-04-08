import mongoose from 'mongoose'

//function to connect to mongodb db
const connectDB = async () => {
    mongoose.connection.on('connected',()=>console.log('database connected'))
    await mongoose.connect(`${process.env.MONGODB_URL}/job-portal`)
    
}

export default connectDB