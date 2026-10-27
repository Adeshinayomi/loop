const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dns = require("node:dns");
const connectToMongoDB = require("./Config/DatabaseConfig").connectToMongoDB;
const UserRoute = require('./Routes/User.route') 
const postRoute = require('./Routes/Post.route')

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

app.use(express.json());
app.use('/users', UserRoute)
app.use('/posts',postRoute)

app.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});