const express = require("express");
const Notification = require("../models/notifications.model");

const router = express.Router();

router.get("", (req, res, next)=>{
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



router.delete("/:id",(req,res,next)=>{
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

router.put("/markAsSeen",(req,res,next)=>{
  let notifications = req.body.notifications;
  for(var i=0; i<notifications.length ; i++){
    const notification = new Notification({
      _id: notifications[i]["_id"],
      data: notifications[i]["data"],
      seenStatus: true
    });
    Notification.findOneAndUpdate({_id: notifications[i]["_id"]}, notification).then(result =>{
      console.log(result);
    });
  }
  res.status(200).json({
    message: "success"
  });
});


module.exports = router;
