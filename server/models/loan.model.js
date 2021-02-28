const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringifyConfiguration } = require("tslint/lib/configuration");

const loanSchema = mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Student"},
    instrument: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Instrument"}, // instrument id
    from: {type: String, required: true},
    to: {type: String, required: false},
    openUser: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    closeUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    notes: {type: String},
    status: {type: String, required: true}
});

loanSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Loan", loanSchema);
