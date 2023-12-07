import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo Connected successfully`);
  } catch (error) {
    console.log(`Connection error : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
