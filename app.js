const express=require("express");
const authRouter=require("./routes/authRoute");
const userRouter=require("./routes/userRoute");
const CustomError=require("./utils/CustomError");
const errorHandler=require("./controllers/errorController");

const app=express();

//json body parser
app.use(express.json());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);

//default route
app.all("*",(req,res,next)=>{
    const err=new CustomError(`${req.originalUrl} route not found`,404);
    next(err);
});

//global error handler
app.use(errorHandler);

module.exports=app;