const express = require("express");
const Loan = require("../models/loan.model")
const Instrument = require("../models/instrument.model")


const router = express.Router();

router.post("/loanInstrument", (req, res, next)=>{

    Instrument.findOne({id: req.body.id})
    .then(result => {
        if(result.status === "available") {
            const loan = new Loan({
                student: req.body.student,
                instrument: req.body.instrument,
                from: req.body.from,
                to: req.body.to
            });
            loan.save()
            .then(result => {
                res.status(201).json({});
                const instrument1 = new Instrument({
                    status: "loaned"
                  });
                Instrument.updateOne({_id: result._id}, instrument1, function(err, res) {
                    if(err) console.log(err);
                    console.log("updated");
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({});
            });
        }
        else {
            res.status(400).json({})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({})
    })
});

router.get("", (req, res, next)=>{
    Loan.find().then(loans => {
        if(loans) {
            res.status(200).json({
                message: "Loans fetched successfully!",
                loans: loans
            });
        }
        else {
            res.status(404).json({})
        }
    })
})

module.exports = router;
