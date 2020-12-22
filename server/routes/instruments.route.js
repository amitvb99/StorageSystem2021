const express = require("express");
const Instrument = require("../models/instrument.model");

const router = express.Router();


router.get("", (req, res, next)=>{
  try{
    const instuments = Instrument.find();
    res.status(200).json({
    message: "instruments fetched successfully!",
    instuments: instuments
    });
  }
  catch(err){
    res.status(500).json({})
  }
});

router.post("/create", (req, res, next)=>{
  try{
    const instument = new Instument({
      generalSerialNumber: req.body.generalSerialNumber,
      type: req.body.type,
      sub_type: req.body.sub_type,
      company: req.body.company,
      model: req.body.model,
      imprentedSerialNumber: req.body.imprentedSerialNumber,
      ownership: req.body.ownership,
      status: req.body.status
    });
    result = instument.save();
    res.status(201).json({});
  }catch(err){
    res.status(500).json({});
  }
});

//update
router.put("/:id", (req, res, next)=>{
  try{
    const instument = new Instument({
      generalSerialNumber: req.body.generalSerialNumber,
      type: req.body.type,
      sub_type: req.body.sub_type,
      company: req.body.company,
      model: req.body.model,
      imprentedSerialNumber: req.body.imprentedSerialNumber,
      ownership: req.body.ownership,
      status: req.body.status
    });
    Instrument.updateOne({generalSerialNumber: req.params.generalSerialNumber},instument).then(result => {
      res.status.json({});
    })
  }catch(err){
    res.status(500).json({});
  }
});

router.get("/type/:id", (req, res, next)=>{

});

router.get("/:id", (req, res, next)=>{
  Instrument.findById(req.params.generalSerialNumber).then(instument => {
    if (instument) {
      res.status(200).json(instument);
    } else {
      res.status(404).json({});
    }
  });
});

router.delete("/:id", (req, res, next)=>{
  try{
    Student.deleteOne({ generalSerialNumber: req.params.generalSerialNumber }).then(result => {
      res.status(200).json({});
    });
  }
  catch(err){
    res.status(500).json({});
  }
});

router.delete("/type/:id", (req, res, next)=>{

});


router.get("/instrumentHistory", (req, res, next)=>{

});


module.exports = router;
