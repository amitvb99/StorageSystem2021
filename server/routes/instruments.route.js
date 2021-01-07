const express = require("express");
const Instrument = require("../models/instrument.model");
const checkAuth= require("../middleware/check-auth");

const router = express.Router();


router.get("", checkAuth, (req, res, next)=>{

    Instrument.find().then(instruments=>{
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

});

router.post("/create", checkAuth, (req, res, next)=>{
    const instument = new Instrument({
      generalSerialNumber: req.body.generalSerialNumber,
      type: req.body.type,
      sub_type: req.body.sub_type,
      company: req.body.company,
      style: req.body.style,
      imprentedSerialNumber: req.body.imprentedSerialNumber,
      ownership: req.body.ownership,
      status: req.body.status
    });
    console.log(instument);
    instument.save()
    .then(result =>{
      res.status(201).json({});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({});
    });

});

//update
router.put("/:id", checkAuth, (req, res, next)=>{

  const instrument = new Instrument({
      _id: req.body._id,
      generalSerialNumber: req.body.generalSerialNumber,
      type: req.body.type,
      sub_type: req.body.sub_type,
      company: req.body.company,
      style: req.body.style,
      imprentedSerialNumber: req.body.imprentedSerialNumber,
      ownership: req.body.ownership,
      status: req.body.status
    });
    Instrument.updateOne({_id: instrument._id},instrument1).then(result => {
      res.status(200).json({});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json();
    });
});

router.get("/type/:id", checkAuth, (req, res, next)=>{

});

router.get("/:id", (req, res, next)=>{
  Instrument.findOne({generalSerialNumber: req.params.id}).then(instrument => {
    if (instrument) {
      res.status(200).json(instrument);
    } else {
      res.status(404).json({});
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next)=>{
  Instrument.deleteOne({ generalSerialNumber: req.params.id }).then(result => {
    res.status(200).json({});
  })
.catch(err => {
  res.status(500).json({});
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
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type == "type" && subtype == 'subtype' && status != 'status')
    Instrument.find({status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type == "type" && subtype != 'subtype' && status == 'status')
    Instrument.find({sub_type: subtype}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type != "type" && subtype == 'subtype' && status == 'status')
    Instrument.find({type: type}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type == "type" && subtype != 'subtype' && status != 'status')
    Instrument.find({sub_type: subtype,status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type != "type" && subtype == 'subtype' && status != 'status')
    Instrument.find({type: type,status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type != "type" && subtype != 'subtype' && status == 'status')
    Instrument.find({type: type,sub_type: subtype}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

  if (type != "type" && subtype != 'subtype' && status != 'status')
    Instrument.find({type: type,sub_type: subtype,status: status}).then(instruments => {
      if(!instruments){
        res.status(500).json({});
      }
      return instruments;
    })
    .then(instruments=>{
      res.status(200).json({
        message: "instruments fetched successfully!",
        instruments: instruments
        });
    })
    .catch(err => {
      res.status(500).json({});
    });

});

router.delete("/type/:id", (req, res, next)=>{

});


router.get("/instrumentHistory", (req, res, next)=>{

});


module.exports = router;
