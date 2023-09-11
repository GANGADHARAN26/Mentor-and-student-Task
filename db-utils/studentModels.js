import mongoose, { Schema } from "mongoose";
const studentSchema =new mongoose.Schema({
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
    currentMentor:{
        type:String,
        
    },
    previousMentor:{
        type:[String]
    }
})
const student=mongoose.model('Student',studentSchema)
export {student}