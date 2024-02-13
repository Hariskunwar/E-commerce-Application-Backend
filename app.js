const express=require("express");
const authRouter=require("./routes/authRoute");

const app=express();

//json body parser
app.use(express.json());

app.use("/api/v1/auth",authRouter);

module.exports=app;