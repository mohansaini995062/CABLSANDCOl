import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    phone:String,
    message:String,
});

const Contact = mongoose.model("Contact",contactSchema);
export default Contact