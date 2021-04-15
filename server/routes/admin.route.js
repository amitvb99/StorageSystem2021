const express = require("express");
const User = require("../models/user.model");

const router = express.Router();


router.post("/demoteAdmin/:id", (req, res, next)=>{
  const user = new User({
    _id: req.params.id,
    privilege: 'user'
  });
  User.updateOne({_id: req.params.id},user).then(u =>{
    res.status(200).json({
          message: "success",
          data: req.params.id
      });
      })
      .catch(err=>{
        res.status(500).json({
          message: "failed"
        });
    });
});

router.post("/promoteUser/:id", (req, res, next)=>{
  const user = new User({
    _id: req.params.id,
    privilege: 'admin'
  });
  User.updateOne({_id: req.params.id},user).then(u =>{
    res.status(200).json({
          message: "success",
          data: req.params.id
      });
      })
      .catch(err=>{
        res.status(500).json({
          message: "failed"
        });
    });
});
module.exports = router;
