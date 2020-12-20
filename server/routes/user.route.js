const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");



const router = express.Router();

router.post("/login1", (req, res, next)=>{
  let fetchdeUsre;
  User.findOne({email: req.body.email}).then(user =>{
    if(!user){
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchdeUsre = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: "Auth Failed"
      });
    }
    const token = jwt.sign({email: fetchdeUsre.email, userId: fetchdeUsre._id},
     'secret_this_should_be_longerr',
     {expiresIn: "1h"});
     res.status(200).json({
       token: token
     });
  })
  .catch(err =>{
    return res.status(401).json({
      message: "Auth Failed"
    });
  });
});

router.post("/login", (req, res, next)=>{
  try{
      let user = User.findOne({email: req.body.email});

      if(!user){
        return res.status(401).json({message: "Auth Failed"});
      }
      // if (!bcrypt.compare(req.body.password, user.password)){
      //   console.log('hetr');
      //   return res.status(401).json({message: "Auth Failed"});
      // }
      if(!req.body.password===user.password){
        return res.status(401).json({message: "Auth Failed"});
      }
      const token = jwt.sign({email: user.email, userId: user._id},'secret_this_should_be_longerr',{expiresIn: "1h"});
      return res.status(200).json({token: token});
  }
  catch(err){
    console.log(err);
      return res.status(401).json({message: "Auth Failed"});
  }


});

router.get("/generateReport", (req, res, next)=>{

});

router.get("/importData", (req, res, next)=>{

});










module.exports = router;
