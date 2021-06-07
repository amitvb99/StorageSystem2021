const express = require("express");
const Student = require("../models/student.model");
const Loan = require("../models/loan.model")
const checkAuth= require("../middleware/check-auth");
const multer= require("multer");
const csv = require('csvtojson');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { Console } = require("console");

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
  console.log(req.file.filename);
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
 res.status(200).json({
          message: "success",
          data: students
          });
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
      Loan.find({student: req.params.id})
      .populate('student')
      .populate('instrument')
      .populate('openUser')
      .populate('closeUser').then(result =>{
        let data = {};
        data['student']=student;
        data['loans'] = result;
        res.status(200).json({
          message: "success",
          data: data
        });
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

  let map = {}
  Class !=='class' ? map['class'] = Class:1;
  level !== 'level' ?  map['level'] = level:1;

  if(freeText){
  Student.find(map).or([{fName:freeText},{lName:freeText},{parent1Name:freeText},{parent2Name:freeText}])
  .then(students => {
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
}
    else{
      Student.find(map)
  .then(students => {
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
    }
});


router.get("/stuentsHistory", (req, res, next)=>{

});

router.get("/export/ex", (req, res, next)=>{
  Student.find().then(students=>{
    if(students){
      const csvWriter = createCsvWriter({
        path: "server/files/students.csv",
        header: [
          { id: "_id", title: "_id" },
          { id: "fName", title: "first name" },
          { id: "lName", title: "last name" },
          { id: "school", title: "school" },
          { id: "grade", title: "grade" },
          { id: "class", title: "class" },
          //to be continued
        ]
      });

      csvWriter
        .writeRecords(students)
        .then(()=>
          console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
       );
      var path= __dirname.slice(0,__dirname.length-6)+'files\\students.csv';
      console.log(path);
      res.download(path);
      //  return res.status(200).json({message: "success"});
    }
    else{
      res.status(500).json({
        message: "failed"
      });
    }
  })
});

module.exports = router;
