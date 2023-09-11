import express from "express";


import connectDb from "./db-utils/mongoConnection.js";
import studentRoute from "./routes/students.js";
import mentorRoute from "./routes/mentor.js";
const app=express();
await connectDb();
const PORT=process.env.PORT||5050;
app.use(express.json());
app.get("/api", (req, res)=>{
    res.send("api running");
    console.log('api running');
})
app.use('/student', studentRoute);
app.use('/mentors',mentorRoute);
app.listen(PORT, ()=>console.log(`listening on ${PORT}`));
