var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phone = new Schema({
    email: String,
    name: String,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model('Phone', phone);
