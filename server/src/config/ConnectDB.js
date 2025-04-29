const mongoose = require("mongoose");
const {DB_NAME}=require("../utils/constant")

const connectDB = async () => {
        try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("mongodb connected");
  } catch (error) {
    console.log("Mongodb connection error", error);
  }
}; 

module.exports = connectDB;
