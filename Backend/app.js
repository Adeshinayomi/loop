const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectToMongoDB = require("./Config/DatabaseConfig").connectToMongoDB;
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

app.use(express.json());


app.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});