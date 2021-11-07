const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv=require("dotenv"); 
const app = express();
const PORT = 4000;
const userRoute = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts")

 
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)


mongoose.connect(
  "mongodb+srv://test1234:test1234@cluster0.wndkr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("connected to the database");
});

app.listen(PORT, () => {
  console.log(`backend server running at port${PORT}`);
});
