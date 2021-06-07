const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const fixesSchema = mongoose.Schema({
    maintainer: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Maintainer"},
    instrument: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Instrument"}, // instrument id
    from: {type: String, required: true},
    to: {type: String, required: false},
    openUser: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    closeUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    notes: {type: String},
    status: {type: String, required: true}
});

fixesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Fix", fixesSchema);
