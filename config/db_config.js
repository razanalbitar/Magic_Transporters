const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongodb");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
