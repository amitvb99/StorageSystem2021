const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const checkAuth= require("../middleware/check-admin-auth");


const router = express.Router();

router.post("/login", (req, res, next)=>{
  let fetchdeUsre;
  User.findOne({username: req.body.username}).then(user =>{
    if(!user){
      return res.status(401).json({
      });
    }
    fetchdeUsre = user;
    return req.body.password== user.password;
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
      });
    }
    let token='';
    fetchdeUsre.username == 'admin' ?
    token = jwt.sign({username: fetchdeUsre.username, userId: fetchdeUsre._id},
     'secret_this_should_be_longer_admin',
     {expiresIn: "1h"}) :
     token = jwt.sign({username: fetchdeUsre.username, userId: fetchdeUsre._id},
      'secret_this_should_be_longer_user',
      {expiresIn: "1h"});

     res.status(200).json({
       token: token
     });
  })
  .catch(err =>{
    return res.status(401).json({
    });
  });
});

router.post("/login1", (req, res, next)=>{
  try{
      let user = User.findOne({username: req.body.username});

      if(!user){
        return res.status(401).json({message: "Auth Failed"});
      }

      if(!req.body.password===user.password){
        return res.status(401).json({message: "Auth Failed"});
      }
      const token = jwt.sign({username: user.username, userId: user._id},'secret_this_should_be_longerr',{expiresIn: "1h"});
      return res.status(200).json({name: user.name, token: token, username: user.username});
  }
  catch(err){
    console.log(err);
      return res.status(401).json({});
  }


});


router.post("/logout", (req, res, next)=>{

});



router.post("/register",checkAuth, (req, res, next)=>{
    const user = new User({name: req.body.name, username: req.body.user, password: req.body.pass});
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
        });
      })
      .catch(err => {
        res.status(500).json({
        });
      });
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

router.get("/users", (req, res, next)=>{

  User.find()
    .then(users =>{
      if(!users){
        res.status(500).json({});
      }
      return users;
    })
    .then(users => {
      return res.status(200).json({
        message: "users fetched successfully!",
        users: users
        });
    })
    .catch(err => {
      res.status(500).json({});
    });
});








module.exports = router;
