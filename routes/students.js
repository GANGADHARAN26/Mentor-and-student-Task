import express from "express";
import { student } from "../db-utils/studentModels.js";
import { mentor as searchMentor } from "../db-utils/mentorModels.js";

const studentRoute = express.Router();

studentRoute.get("/", (req, res) => {
  res.send({ message: "student" });
});
//endpoint to create a new student
studentRoute.post("/add", async (req, res) => {
  const emailFound = await student.findOne({ email: req.body.email });
  //email matching
  if (emailFound) {
    return res.status(400).send("Email already exist");
  }
  const idFound = await student.findOne({ Id: req.body.id });
  //id matching
  if (idFound) {
    return res.status(400).send("Id already assigned ");
  }
  try {
    const studentcreate = new student(req.body);
    await studentcreate.save();
    res.send({ message: "student created successfully" });
    console.log(studentcreate.previousmentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//endpoint to show previous students to particular students
studentRoute.get("/previousMentors/:Name", async (req, res) => {
  try {
    const { Name } = req.params;
    const students = await student.findOne({ name: Name });
    if (!students) {
      return res.status(400).send("student not found");
    }
    res.send(students.previousMentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//endpoint to show all students to specific mentors
studentRoute.get("/getStudents/:mentorName", async (req, res) => {
  try {
    const { mentorName } = req.params;
    const mentors = await student.find({ currentMentor: mentorName });
    const studentList = [];
    mentors.map((student) => studentList.push(student.name));
    res.send({ studentList: studentList });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//endpoint to assign or change the mentor for particular student
studentRoute.post("/assignMentor", async (req, res) => {
  const { studentId, mentor } = req.body;

  try {
    const mentors = await searchMentor.findOne({ name: mentor });
    if (!mentors) {
      return res.status(400).send("mentor not found");
    }

    const studentName = await student.findOne({ id: studentId });
    if (!studentName) {
      return res.status(400).send("student not found");
    } else {
      //fetching previousmentos
      const previous_mentors = studentName.previousMentor;
      //pushing currentmentor to previous mentors
      const addedList = [...previous_mentors, studentName.currentMentor];
      //updating previous mentors array
      await studentName.updateOne({ previousMentor: addedList });
      //updating the current mentor
      await studentName.updateOne({ currentMentor: mentor });
      return res
        .status(200)
        .send("previous mentor added and current mentor changed successfully");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//endpoint to assign mentors to students who doesn't have mentors
studentRoute.post("/multipleAssign", async (req, res) => {
  //students array to assign mentor
  const students_name = req.body.students;
  const mentor = req.body.mentor;
  try {
    //chenking does mentor exist in database
    const isMentor = await searchMentor.findOne({ name: mentor });
    if (!isMentor) {
      res.status(400).send("mentor is not exist");
    }
    //students iteration which assign mentors to students who don't have mentors
    const updatesList=[];
    for (const singleStudent of students_name) {
       //checking whether the students exist
       const studentCheck=await student.findOne({ name: singleStudent})
       if (!studentCheck) {
        res.status(400).send("student is not exist");
      }
      updatesList.push(studentCheck.name)
        //fetching previousmentos
      const previous_mentors = studentCheck.previousMentor;
      //pushing currentmentor to previous mentors
      const addedList = [...previous_mentors, studentCheck.currentMentor];
      //updating previous mentors array
      await studentCheck.updateOne({ previousMentor: addedList });
      //updating the current mentor
      await studentCheck.updateOne({ currentMentor: mentor });
    }
    res.status(200).send({"updates students":updatesList})
  } catch (error) {
    res.status(400).send(error.message);
  }
});
export default studentRoute;
