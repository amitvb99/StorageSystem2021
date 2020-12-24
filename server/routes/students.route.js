const express = require("express");
const Student = require("../models/student.model");
const checkAuth= require("../middleware/check-auth");

const router = express.Router();

router.post("/create", (req, res, next)=>{
    const student = new Student({
      fName: req.body.fName,
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
    student.save()
    .then(result => {
      res.status(201).json({});
    })
    .catch(err => {
      res.status(500).json({});
    });
});

router.get("", (req, res, next)=>{

    Student.find()
      .then(students =>{
        if(!students){
          res.status(500).json({});
        }
        return students;
      })
      .then(students => {
        return res.status(200).json({
          message: "Students fetched successfully!",
          students: students
          });
      })
      .catch(err => {
        res.status(500).json({});
      });
});

//update
router.put("/:id", (req, res, next)=>{

  student = Student.findOne({id: req.params.id}).then(student =>{

  const student1 = new Student({
    _id: student._id,  //WTF?!
    fName: req.body.fName,
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

    Student.updateOne({_id: student._id},student1).then(t => {
      res.status(200).json({message: "Student Updated!"});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({err});
    });
  });
});

router.get("/:id", (req, res, next)=>{
  Student.findOne({id: req.params.id}).then(student => {
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found!" });
    }
  });
});

router.delete("/:id", (req, res, next)=>{
  Student.deleteOne({ id: req.params.id }).then(result => {
      res.status(200).json({});
    })
  .catch(err => {
    res.status(500).json({});
  });

});

router.get("/stuentsHistory", (req, res, next)=>{

});

module.exports = router;
