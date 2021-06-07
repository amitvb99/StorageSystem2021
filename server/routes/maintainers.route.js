const express = require("express");
const Maintainer = require("../models/maintainer.model");
const Instrument = require("../models/instrument.model");
const checkAuth= require("../middleware/check-auth");
const multer= require("multer");
const csv = require('csvtojson');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { Console } = require("console");
const { model } = require("../models/maintainer.model");

const router = express.Router();

router.post("/create", (req, res, next) => {
    console.log(req.body.maintainerPhone)
    const maintainer = new Maintainer({
        maintainerName: req.body.maintainerName,
        maintainerPhone: req.body.maintainerPhone,
        maintainerAddress: req.body.maintainerAddress,
    });
    maintainer.save()
    .then(result => {
      res.status(201).json({
        message: "success",
        data: maintainer._id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "failed"
      });
    });
});

router.get("", (req, res, next)=>{
    // console.log(req.headers.user_id)
    console.log("getting maintainers")
    Maintainer.find()
      .then(maintainers =>{
        if(!maintainers){
          res.status(500).json({});
        }
        return maintainers;
      })
      .then(maintainers => {
        return res.status(200).json({
          message: "success",
          data: maintainers
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "failed"
        });
      });
});

router.put("/:id", (req, res, next)=>{
    console.log(req.body.maintainerName)

    const maintainer = new Maintainer({
        _id: req.params.id,
        maintainerName: req.body.maintainerName,
        maintainerPhone: req.body.maintainerPhone,
        maintainerAddress: req.body.maintainerAddress,
    });

      Maintainer.updateOne({ _id: req.params.id },maintainer).then(t => {
        res.status(200).json({
          message: "success",
          data: req.params._id
      });
      })
      .catch(err=>{
        res.status(500).json({
          message: "failed"
        });
      });
  });

  router.get("/:id", (req, res, next)=>{
    Maintainer.findOne({_id: req.params.id}).then(maintainer => {
      if (maintainer) {
          // if you want, add previous maintainance to maintainer
        res.status(200).json({
              message: "success",
              data: {'maintainer' : maintainer}
            });
      } else {
        res.status(404).json({ message: "failed" });
      }
    });
  });

router.delete("/:id", (req, res, next)=>{
  Maintainer.deleteOne({ _id: req.params.id }).then(result => {
      res.status(200).json({
          message: "success",
          data: req.params._id
      });
      })
    .catch(err => {
        res.status(500).json({
        message: "failed"
        });
    });
});

  module.exports = router
