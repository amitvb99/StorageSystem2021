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
      let user = User.findOne({username: req.body.username});

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
      const token = jwt.sign({username: user.username, userId: user._id},'secret_this_should_be_longerr',{expiresIn: "1h"});
      return res.status(200).json({name: user.name, token: token, username: user.username});
  }
  catch(err){
    console.log(err);
      return res.status(401).json({message: "Auth Failed"});
  }


});


router.post("/logout", (req, res, next)=>{

});



router.post("/register", (req, res, next)=>{
  try{
    console.log("here");
    const user = new User({name: req.body.name, username: req.body.user, password: req.body.pass});
    result = user.save();
    res.status(201).json({message: "User Created!", result: result});
  }
  catch(err){
    res.status(500).json({message: err});
  }
});


router.get("/generateReport", (req, res, next)=>{

});


router.get("/importData", (req, res, next)=>{

});


router.delete("/:id", (req, res, next)=>{
  User.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "deleted"});
  });
});








module.exports = router;
