import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGO_DB;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log("***************************************");
  console.log(`Server Running on port number : ${PORT}`);
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MONGO_DB Connection successfull......!!");
  console.log("***************************************");
});


import User from "./router/User.js";
app.use("/user", User);
import Lecture from "./router/Lecture.js";
app.use("/lecture", Lecture);
import DatesBook from "./router/DatesBook.js";
app.use("/date", DatesBook);