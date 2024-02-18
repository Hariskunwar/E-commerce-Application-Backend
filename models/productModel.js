const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter product description"],
    },
    price:{
        type:Number,
        required:[true,"Please enter product price"],
    },
    image:String,
    category:{
        type:String,
        required:[true,"Please enter product category"],
    },
    brand:{
        type:String,
        required:[true,"Please enter product category"],
    },
    quantity:{
        type:Number,
        default:0
    },
    sold:{
        type:Number,
        default:0
    },
    color:{
        type:String,
        required:[true,"Enter product color"]
    },
    ratings:[
        {
            star:Number,
            ratedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        }
    ],
    avgRate:{
        type:Number,
        default:0
    }

},{timestamps:true});

module.exports=mongoose.model("Product",productSchema);