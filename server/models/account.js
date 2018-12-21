var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var account = new Schema({
    email: String,
    password: String,
    phones:[{type: ObjectId, ref:'Phone'}]
});

module.exports = mongoose.model('Account', account);
