import mongoose from "mongoose";
const mentorSchema =new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
})
const mentor=mongoose.model('Mentor',mentorSchema)

export {mentor}