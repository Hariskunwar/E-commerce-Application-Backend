const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        required:[true,"Category is required"],
        unique:true
    }
},{timestamps:true});

module.exports=mongoose.model("Category",categorySchema);