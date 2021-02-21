const express = require("express");
const Student = require("../models/student.model");
const checkAuth= require("../middleware/check-auth");
const multer= require("multer");




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error='';
    file.mimetype=='csv' ? error = new Error("Invalid mime type") : error =null;
    cb(error, "../files");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = 'csv';
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});


const router = express.Router();

router.post("/create", checkAuth,(req, res, next)=>{
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
      console.log(err);
      res.status(500).json({});
    });
});

router.post("/insertExcel", multer(storage).single("excel"),checkAuth,(req, res, next)=>{
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
    console.log(err);
    res.status(500).json({});
  });
});

router.get("", checkAuth,(req, res, next)=>{

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
router.put("/:id",checkAuth, (req, res, next)=>{

  const student = new Student({
    _id: req.body._id,  //WTF?!
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

    Student.updateOne({ _id: req.params.id },student).then(t => {
      res.status(200).json({message: "Student Updated!"});
    })
    .catch(err=>{
      res.status(500).json({err});
    });
});

router.get("/:id",checkAuth, (req, res, next)=>{
  Student.findOne({id: req.params.id}).then(student => {
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found!" });
    }
  });
});

router.delete("/:id",checkAuth, (req, res, next)=>{
  Student.deleteOne({ id: req.params.id }).then(result => {
      res.status(200).json({});
    })
  .catch(err => {
    res.status(500).json({});
  });

});

router.get("/filter/:params", (req, res, next)=>{

  let filterString=req.params.params.split('-');
  let discreteFields = filterString[0].split('_');
  let freeText = filterString[1];
  let Class = discreteFields[0];
  let level = discreteFields[1];


  if (Class == "class" && level == 'level')
    Student.find().then(students => {
      if(!students){
        res.status(500).json({});
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "students fetched successfully!",
        students: students
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (Class == "class" && level != 'level')
    Student.find({grade: level}).then(students => {
      if(!students){
        res.status(500).json({});
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "students fetched successfully!",
        students: students
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (Class != "class" && level == 'level')
    Student.find({class: Class}).then(students => {
      if(!students){
        res.status(500).json({});
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "students fetched successfully!",
        students: students
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (Class != "class" && level != 'level')
    Student.find({class: Class, grade: level}).then(students => {
      if(!students){
        res.status(500).json({});
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "students fetched successfully!",
        students: students
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

});


router.get("/stuentsHistory", (req, res, next)=>{

});

module.exports = router;
