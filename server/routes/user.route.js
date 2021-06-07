const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const checkAuth= require("../middleware/check-admin-auth");


const router = express.Router();

router.post("/login", (req, res, next)=>{
  if(req.body.username == 'admin'){
    if(req.body.password == '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'){
      token = jwt.sign({username: req.body.username, userId: 'admin'},
        'secret_this_should_be_longer_admin',
        {expiresIn: "1h"});
        return res.status(200).json({
          message: "success",
           data: {token: token,
           name: "admin",
           id: "admin"}
         });
    }
  }
  let fetchdeUsre;
  User.findOne({username: req.body.username}).then(user =>{
    if(!user){
      return res.status(401).json({
        message: "failed"
      });
    }
    fetchdeUsre = user;
    return req.body.password  == user.password;
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: "failed"
      });
    }
    let token='';
    if(fetchdeUsre){
    fetchdeUsre.privilege == 'admin' ?                //// need  to change .. privilege instead of username
    token = jwt.sign({username: fetchdeUsre.username, userId: fetchdeUsre._id},
     'secret_this_should_be_longer_admin',
     {expiresIn: "1h"}) :
    token = jwt.sign({username: fetchdeUsre.username, userId: fetchdeUsre._id},
     'secret_this_should_be_longer_user',
     {expiresIn: "1h"});

     res.status(200).json({
      message: "success",
       data: {token: token,
       name: fetchdeUsre.name,
       id: fetchdeUsre.id}
     });
    }
  })
  .catch(err =>{
    console.log(err);
    return res.status(401).json({
      message: "failed"
    });
  });
});




router.post("/logout", (req, res, next)=>{

});



router.post("/register", (req, res, next)=>{
    const user = new User({name: req.body.name, username: req.body.username, password: req.body.password, privilege: req.body.privilege});

    user.save()
      .then(result => {
        res.status(201).json({
          message: "success",
          data: user.id
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "failed"
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
        message: "success",
        data: users
        });
    })
    .catch(err => {
      res.status(500).json({});
    });
});

module.exports = router;
