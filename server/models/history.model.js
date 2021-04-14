const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const historySchema = mongoose.Schema({
    instrument: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Instrument"}, // instrument id
    date: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    notes: {type: String},
    status: {type: String, required: true}
});

historySchema.plugin(uniqueValidator);

module.exports = mongoose.model("History", historySchema);
