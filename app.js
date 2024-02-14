const express=require("express");
const authRouter=require("./routes/authRoute");
const userRouter=require("./routes/userRoute");

const app=express();

//json body parser
app.use(express.json());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);

module.exports=app;