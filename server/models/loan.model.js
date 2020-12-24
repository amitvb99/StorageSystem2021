const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringifyConfiguration } = require("tslint/lib/configuration");

const loanSchema = mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "studentSchema"},
    instrument: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "instrumentSchema"}, // instrument id
    from: {type: String, required: true},
    to: {type: String, required: false}
});

loanSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Loan", loanSchema);