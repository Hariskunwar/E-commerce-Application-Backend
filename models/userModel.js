const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique: true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
   
    mobile:{
        type:String,
        required:[true,"Please enter your phone number"],
        unique: true,
        },
    photo:{
        type:String,
        default:"https://i.stack.imgur.com/l60Hf.png"
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:6,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,"Please confirm your password"],
        validate:{
            validator:function(val){
               return val==this.password;
            },
            message:"password and confirm password does not match"
        }
    },
    passwordChangedAt:Date
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    next();
});

userSchema.methods.comparePassword=async function(userEnteredPwd,dbPassword){
    return bcrypt.compare(userEnteredPwd,dbPassword);
}

userSchema.methods.isPasswordChanged=async function(jwtTimestamp){
    if(this.passwordChangedAt){
        const pwdChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
    return jwtTimestamp<pwdChangedTimestamp;
    }
    return false;
}


module.exports=mongoose.model("User",userSchema);