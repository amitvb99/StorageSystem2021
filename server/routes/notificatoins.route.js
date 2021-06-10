const express = require("express");
const Notification = require("../models/notifications.model");
const checkAdminAuth = require("../middleware/check-admin-auth")
const router = express.Router();

router.get("", checkAdminAuth,(req, res, next)=>{
  Notification.find()
      .then(notifications =>{
        if(!notifications){
          res.status(500).json({});
        }
        return notifications;
      })
      .then(notifications => {
        return res.status(200).json({
          message: "success",
          data: notifications
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "failed"
        });
      });
});



router.delete("/:id",checkAdminAuth,(req,res,next)=>{
  Notification.deleteOne({ _id: req.params.id }).then(instrument => {
    res.status(200).json({
        message: "success",
        data: req.params.id
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "failed"
    });
  });
});

router.put("/markAsSeen/:id",checkAdminAuth,(req,res,next)=>{
  let id = req.params.id;
  Notification.find({_id: id}).then(not =>{
    if(not){
    const notification = new Notification({
      _id: id,
      data: not.data,
      seenStatus: true
    });
    Notification.findOneAndUpdate({_id: id}, notification).then(result =>{
      res.status(200).json({
        message: "success"
      });
    });
  }
  else{
    res.status(404).json({
      message: "fail"
    });
  }
  });
});


module.exports = router;
