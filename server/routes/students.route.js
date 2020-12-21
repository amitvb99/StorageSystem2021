const express = require("express");
const Student = require("../models/student.model");
const checkAuth= require("../middleware/check-auth");

const router = express.Router();

router.post("/create", checkAuth,(req, res, next)=>{
  try{
    const student = new Student({
      fname: req.body.fName,
      lName: req.body.lName,
      school: req.body.school,
      grade: req.body.grade,
      class: req.body.class,
      id: req.body.id,
      parent1Name: req.body.parent1Name,
      parent2Name: req.body.parent2Name,
      parent1PhoneNumber: req.body.parent1PhoneNumber,
      parent2PhoneNumber: req.body.parent2PhoneNumber,
      parent1Email: req.body.parent1Email,
      parent2Email: req.body.parent2Email,
      instruments: req.body.instruments,
    });
    result = student.save();
    res.status(201).json({message: "User Created!", result: result});
  }catch(err){
    res.status(500).json({message: err});
  }
});

router.get("", (req, res, next)=>{
  const students = Student.find();
  res.status(200).json({
  message: "Students fetched successfully!",
  students: students
  });
});

router.put("/:id", (req, res, next)=>{
  const student = new Student({
    fname: req.body.fName,
    lName: req.body.lName,
    school: req.body.school,
    grade: req.body.grade,
    class: req.body.class,
    id: req.body.id,
    parent1Name: req.body.parent1Name,
    parent2Name: req.body.parent2Name,
    parent1PhoneNumber: req.body.parent1PhoneNumber,
    parent2PhoneNumber: req.body.parent2PhoneNumber,
    parent1Email: req.body.parent1Email,
    parent2Email: req.body.parent2Email,
    instruments: req.body.instruments,
  });
  Student.updateOne({id: req.params.id},student).then(result => {
    res.status.json({message: "Student Updated!"});
  })
});

router.get("/:id", (req, res, next)=>{
  Student.findById(req.params.id).then(student => {
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found!" });
    }
  });
});

router.delete("/:id", (req, res, next)=>{
  Student.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "student deleted!" });
  });
});

router.get("/stuentsHistory", (req, res, next)=>{

});

module.exports = router;
