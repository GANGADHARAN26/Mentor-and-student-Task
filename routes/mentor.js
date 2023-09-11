import express from 'express';
import { mentor } from '../db-utils/mentorModels.js';
const mentorRoute=express.Router();

mentorRoute.get("/",async(req,res)=>{
try{
const mentors=await mentor.find({},{id:1,name:1,email:1,_id:0})
console.log(mentors)
res.send(mentors);
}
catch(error){
  console.log(error.message)
  res.status(500).send({message:"error while getting"})
}
})
//endpoint to create a new mentor
mentorRoute.post("/create",async(req,res)=>{    
    const emailFound = await mentor.findOne({ email: req.body.email })
    //email matching
    if (emailFound) {
        return res.status(400).send("Email already exist")
    }
    const idFound = await mentor.findOne({ Id: req.body.studentId })
    //id matching
    if (idFound) {
        return res.status(400).send("Id already assigned ")
    }
    try{
        const  mentors=new mentor(req.body); 
        await mentors.save()
        res.send({message:"mentor created successfully"})
    }
    catch(error){
        res.status(400).send(error.message);
    }
})

export default mentorRoute