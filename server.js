require("dotenv").config({path:'config/config.env'});
const app=require("./app");
const dbConnect=require("./config/dbConnect");
const cloudinary=require('cloudinary');
dbConnect();

cloudinary.v2.config({
    cloud_name:process.env.CLOUNDINARY_NAME,
    api_key:process.env.CLOUNDINARY_KEY,
    api_secret:process.env.CLOUNDINARY_SECRET
});

const PORT=process.env.PORT ||8000;
app.listen(PORT,()=>{
    console.log(`Server running at port: ${PORT}`);
})