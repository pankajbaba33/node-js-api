const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb+srv://sivaldevops8_db_user:iIBtG2DB1Hj93rF4@hirehubapi.fxxlaub.mongodb.net/hirehubAPi?retryWrites=true&w=majority";

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
    
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;