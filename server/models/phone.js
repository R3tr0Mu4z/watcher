var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var phone = new Schema({
    title: {type: String, default: "Phone Name"},
    email: String,
    locations:[{type: ObjectId, ref:'Location'}]
});

module.exports = mongoose.model('Phone', phone);
