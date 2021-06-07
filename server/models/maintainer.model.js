const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringifyConfiguration } = require("tslint/lib/configuration");

const maintainerSchema = mongoose.Schema({
    maintainerName: {type: String, required: true},
    maintainerPhone: {type: String, required: true},
    maintainerAddress: {type: String, required: true},
});


maintainerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Maintainer", maintainerSchema);