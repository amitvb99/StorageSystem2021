const express = require("express");

const checkAuth= require("../middleware/check-auth");

const router = express.Router();

router.post("/addStudent", checkAuth,(req, res, next)=>{
  console.log('xxx1');
  console.log(req.body.name);
  console.log(req.pass);
});


router.post("/updateStudentDetails", (req, res, next)=>{

});

router.get("/viewStudentDetails", (req, res, next)=>{

});

router.delete("/deleteStudent", (req, res, next)=>{

});

router.get("/stuentsHistory", (req, res, next)=>{

});

module.exports = router;
