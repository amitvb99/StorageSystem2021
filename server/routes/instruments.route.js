const express = require("express");
const Instrument = require("../models/instrument.model");

const router = express.Router();


router.get("", (req, res, next)=>{

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

router.post("/create", (req, res, next)=>{
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
router.put("/:id", (req, res, next)=>{

  Instrument.findOne({generalSerialNumber: req.params.id}).then(instrument=>{
  const instrument1 = new Instrument({
      _id: instrument._id,
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
});

router.get("/type/:id", (req, res, next)=>{

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

router.delete("/:id", (req, res, next)=>{
  Instrument.deleteOne({ generalSerialNumber: req.params.id }).then(result => {
    res.status(200).json({});
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
