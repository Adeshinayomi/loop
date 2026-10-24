const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
};