import mongoose from "mongoose"

const MongoDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB connected')

    } catch (error) {
        console.log(`Error from mongoDB Connection : ${error.message}`)
    }
};

export default MongoDB;