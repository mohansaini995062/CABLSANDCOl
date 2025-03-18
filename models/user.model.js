import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    terms:{
        type:Boolean,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    profile:{
        url:{type:String},
        public_id:{type:String}
    }
});

const User = mongoose.model("User",userSchema)
export default User;