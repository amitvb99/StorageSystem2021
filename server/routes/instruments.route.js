const express = require("express");
const Instrument = require("../models/instrument.model");
const History = require("../models/history.model");
const checkAuth= require("../middleware/check-auth");

const router = express.Router();


router.get("", (req, res, next)=>{

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

router.post("/create", (req, res, next)=>{
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
router.put("/:id", (req, res, next)=>{

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
    Instrument.findOneAndUpdate({_id: req.params.id},instrument,{ returnOriginal: true }).then(result => {
      if(result["status"] !== instrument["status"]){
        console.log(true);
        var datetime = new Date();
        const history_rec = new History({
          instrument: req.params.id,
          date: datetime.toISOString().slice(0,10),
          user: req.headers.user_id,
          status: instrument["status"],
          notes: req.body.notes
        });
        history_rec.save();
      }
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

router.get("/type/:id", (req, res, next)=>{

});

router.get("/:id", (req, res, next)=>{
  Instrument.findOne({_id: req.params.id}).then(instrument => {
    History.find({instrument: instrument._id}).populate('user').then(history => {
      if (instrument) {
        let data = {};
        data['instrument'] = instrument;
        data['history'] = history;
        res.status(200).json({
          message: "success",
          data: data
        });
      } else {
        res.status(404).json({
          message: "failed"
        });
      }
    });
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
  let freeText = filterString[1];
  let map = {}

  let type = discreteFields[0];
  let subtype = discreteFields[1];
  let status = discreteFields[2];
  type !=="type" ?  map['type'] = type:1;
  subtype !== "subtype" ? map['sub_type'] = subtype:1;
  status !== "status" ? map['status'] = status:1;
  if(freeText)
    map['generalSerialNumber'] = freeText;
  Instrument.find(map).then(instruments => {
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
    Instrument.find({sub_type: subtype,status: status, type: type=="type"? null: type}).then(instruments => {
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


router.get("/history/:id", (req, res, next)=>{
  History.find({instrument: req.params.id}).then(history => {
    if (history) {
      res.status(200).json({
        message: "success",
        data: history
      });
    } else {
      res.status(404).json({
        message: "failed"
      });
    }
  });
});


module.exports = router;
