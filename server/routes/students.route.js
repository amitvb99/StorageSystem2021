const express = require("express");
const Student = require("../models/student.model");
const checkAuth= require("../middleware/check-auth");
const multer= require("multer");
const csv = require('csvtojson');
const bodyParser  = require('body-parser');
const path = require('path');



// 1. what should happen if he entered two files with the same name? (override, save the two files with different names)
//2. should we save the file forever (hard desk needed for the server) or to delete them immediatly or save them for a while?
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   let error='';
  //   file.mimetype=='csv' ? error = new Error("Invalid mime type") : error =null;
  //   cb(error, "./server/files");
  // },
  // filename: (req, file, cb) => {
  //   const name = file.originalname
  //     .toLowerCase()
  //     .split(" ")
  //     .join("-");
  //   const ext = 'csv';
  //   cb(null, Date.now()+ "-" + name );
  // }
  destination:(req,file,cb)=>{
    cb(null,'./server/files');
},
filename:(req,file,cb)=>{
    cb(null,Date.now()+ "-" +file.originalname);
}
});

const router = express.Router();

router.post("/create", (req, res, next)=>{
  console.log(req.body.parent1Email)
    const student = new Student({
      fName: req.body.fName,
      lName: req.body.lName,
      school: req.body.school,
      level: req.body.level,
      class: req.body.class,
      // id: req.body.id,
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
      res.status(201).json({
        message: "success",
        data: student._id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "failed"
      });
    });
});


//, multer({ storage: storage }).single("excel")
router.post("/insertExcel",multer({ storage: storage }).single("excel"),(req, res, next)=>{
  csv()
.fromFile("server/files/" + req.file.filename)         ////  server/files/excel3.csv
.then((jsonObj)=>{
     Student.insertMany(jsonObj,(err,data)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
     });
   });
 res.status(200);
});

router.get("", (req, res, next)=>{
    console.log(req.headers.user_id)
    Student.find()
      .then(students =>{
        if(!students){
          res.status(500).json({});
        }
        return students;
      })
      .then(students => {
        return res.status(200).json({
          message: "success",
          data: students
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "failed"
        });
      });
});


//update
router.put("/:id", (req, res, next)=>{
  console.log(req.body.parent1Email)

  const student = new Student({
    _id: req.params.id,
    fName: req.body.fName,
    lName: req.body.lName,
    school: req.body.school,
    level: req.body.level,
    class: req.body.class,
    parent1Name: req.body.parent1Name,
    parent2Name: req.body.parent2Name,
    parent1PhoneNumber: req.body.parent1PhoneNumber,
    parent2PhoneNumber: req.body.parent2PhoneNumber,
    parent1Email: req.body.parent1Email,
    parent2Email: req.body.parent2Email,
    instruments: req.body.instruments,
  });

    Student.updateOne({ _id: req.params.id },student).then(t => {
      res.status(200).json({
        message: "success",
        data: req.params._id
    });
    })
    .catch(err=>{
      res.status(500).json({
        message: "failed"
      });
    });
});

router.get("/:id", (req, res, next)=>{
  Student.findOne({_id: req.params.id}).then(student => {
    if (student) {
      res.status(200).json({
        message: "success",
        data: student
      });
    } else {
      res.status(404).json({ message: "failed" });
    }
  });
});

router.delete("/:id", (req, res, next)=>{
  Student.deleteOne({ _id: req.params.id }).then(result => {
      res.status(200).json({
        message: "success",
        data: req.params._id
      });
    })
  .catch(err => {
    res.status(500).json({
      message: "failed"
    });
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
        res.status(500).json({
          message: "failed"
        });
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "success",
        data: students
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (Class == "class" && level != 'level')
    Student.find({level: level}).then(students => {
      if(!students){
        res.status(500).json({
          message: "failed"
        });
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "success",
        data: students
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (Class != "class" && level == 'level')
    Student.find({class: Class}).then(students => {
      if(!students){
        res.status(500).json({
          message: "failed"
        });
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "success",
        data: students
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (Class != "class" && level != 'level')
    Student.find({class: Class, level: level}).then(students => {
      if(!students){
        res.status(500).json({
          message: "failed"
        });
      }
      return students;
    })
    .then(students=>{
      res.status(200).json({
        message: "success",
        data: students
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

});


router.get("/stuentsHistory", (req, res, next)=>{

});

module.exports = router;
