const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const router = require("./router");
const dotenv = require('dotenv')
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`port is connected on : ${process.env.PORT}`);
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch(() => {
    console.log("DB not connected");
  });
