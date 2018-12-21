var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var location = new Schema({
    name: String,
    lat: Number,
    long: Number
});

module.exports = mongoose.model('Location', location);
