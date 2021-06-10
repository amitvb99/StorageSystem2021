const express = require("express");
const Instrument = require("../models/instrument.model");
const History = require("../models/history.model");
const checkAuth= require("../middleware/check-auth");
const Notification = require("../models/notifications.model");

const router = express.Router();


router.get("", checkAuth,(req, res, next)=>{

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

router.post("/create", checkAuth,(req, res, next)=>{
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
router.put("/:id", checkAuth,(req, res, next)=>{
  Instrument.findOne({_id: req.params.id}).then(result=>{
    if(result.status == 'inFix' || result.status == 'loaned'){
      if(result.status !== req.body.status){
        return res.status(400).json({
          message: `failed: can't edit status ${result.status}`,
        });
      }
    }
  });
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
      console.log(result);
      if(result["status"] !== instrument["status"]){
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
        if(instrument["status"]=="lost"){
          const notification = new Notification({
            data: "the status of intrument " + instrument["generalSerialNumber"] + " has been updated to lost",
            seenStatus: false
          });
          notification.save();
        }
        else if(instrument["status"]=="stolen"){
          const notification = new Notification({
            data: "the status of intrument" + instrument["generalSerialNumber"] + " has been updated to stolen",
            seenStatus: false
          });
          notification.save();
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

router.get("/type/:id",checkAuth, (req, res, next)=>{

});

router.get("/:id", checkAuth,(req, res, next)=>{
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


router.get("/filter/:params", checkAuth,(req, res, next)=>{
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

router.get("/filter/:params", checkAuth,(req, res, next)=>{

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

router.delete("/type/:id", checkAuth,(req, res, next)=>{

});


router.get("/history/:id", checkAuth,(req, res, next)=>{
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


router.post('/init' , checkAuth,(req,res,next)=>{
  const instrument1 = new Instrument({
    generalSerialNumber: '9991',
    type: 'type1',
    sub_type: 'subtype1',
    company: 'company1',
    style: 'style1',
    imprentedSerialNumber: '99911',
    ownership: 'owner1',
    status: 'available'
  });
  const instrument2 = new Instrument({
    generalSerialNumber: '9992',
    type: 'type2',
    sub_type: 'subtype2',
    company: 'company2',
    style: 'style2',
    imprentedSerialNumber: '99922',
    ownership: 'owner2',
    status: 'available'
  });
  const instrument3 = new Instrument({
    generalSerialNumber: '9993',
    type: 'type3',
    sub_type: 'subtype3',
    company: 'company3',
    style: 'style3',
    imprentedSerialNumber: '99933',
    ownership: 'owner3',
    status: 'available'
  });

  instrument1.save();
  instrument2.save();
  instrument3.save();

  res.status(200).json({
    message: 'success',
    data: [instrument1._id, instrument2._id,instrument3._id]
  });

});


module.exports = router;
