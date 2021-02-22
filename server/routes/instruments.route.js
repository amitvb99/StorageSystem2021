const express = require("express");
const Instrument = require("../models/instrument.model");
const checkAuth= require("../middleware/check-auth");

const router = express.Router();


router.get("", checkAuth, (req, res, next)=>{

    Instrument.find().then(instruments=>{
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

});

router.post("/create", checkAuth, (req, res, next)=>{
    const instrument = new Instrument({
      generalSerialNumber: req.body.generalSerialNumber,
      type: req.body.type,
      sub_type: req.body.sub_type,
      company: req.body.company,
      style: req.body.style,
      imprentedSerialNumber: req.body.imprentedSerialNumber,
      ownership: req.body.ownership,
      status: req.body.status
    });
    instrument.save()
    .then(result =>{
      res.status(201).json({
        message: "success",
        data: instrument.id
      });
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        message: "failed"
      });
    });

});

//update
router.put("/:id", checkAuth, (req, res, next)=>{

  const instrument = new Instrument({
      _id: req.params.id,  //WTF?!
      generalSerialNumber: req.body.generalSerialNumber,
      type: req.body.type,
      sub_type: req.body.sub_type,
      company: req.body.company,
      style: req.body.style,
      imprentedSerialNumber: req.body.imprentedSerialNumber,
      ownership: req.body.ownership,
      status: req.body.status
    });
    Instrument.updateOne({_id: req.params.id},instrument).then(result => {
      res.status(200).json({
        message: "success",
        data: instrument.id
      });
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        message: "failed",
      });
    });
});

router.get("/type/:id", checkAuth, (req, res, next)=>{

});

router.get("/:id", checkAuth ,(req, res, next)=>{
  Instrument.findOne({_id: req.params.id}).then(instrument => {
    if (instrument) {
      res.status(200).json({
        message: "success",
        data: instrument
      });
    } else {
      res.status(404).json({
        message: "failed"
      });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next)=>{
  Instrument.deleteOne({ _id: req.params.id }).then(instrument => {
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

router.get("/filter/:params", (req, res, next)=>{

  let filterString=req.params.params.split('-');
  let discreteFields = filterString[0].split('_');
  let serialNum = filterString[1];
  let type = discreteFields[0];
  let subtype = discreteFields[1];
  let status = discreteFields[2];

  if (type == "type" && subtype == 'subtype' && status == 'status')
    Instrument.find({generalSerialNumber: {"$regex": serialNum, "$options": "i"}}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type == "type" && subtype == 'subtype' && status != 'status')
    Instrument.find({status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type == "type" && subtype != 'subtype' && status == 'status')
    Instrument.find({sub_type: subtype}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type != "type" && subtype == 'subtype' && status == 'status')
    Instrument.find({type: type}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type == "type" && subtype != 'subtype' && status != 'status')
    Instrument.find({sub_type: subtype,status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type != "type" && subtype == 'subtype' && status != 'status')
    Instrument.find({type: type,status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type != "type" && subtype != 'subtype' && status == 'status')
    Instrument.find({type: type,sub_type: subtype}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

  if (type != "type" && subtype != 'subtype' && status != 'status')
    Instrument.find({type: type,sub_type: subtype,status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({
          message: "failed"
        });
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "success",
        data: instruments
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "failed"
      });
    });

});

router.delete("/type/:id", (req, res, next)=>{

});


router.get("/instrumentHistory", (req, res, next)=>{

});


module.exports = router;
