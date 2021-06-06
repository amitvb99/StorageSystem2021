const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const notificationSchema = mongoose.Schema({
    data: {type: String, required: true},
    seenStatus: {type:Boolean, required:true}
});

notificationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Notification", notificationSchema);
