var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var location = new Schema({
    id: ObjectId,
    lat: Number,
    long: Number,
    speed: Number,
    timestamp: Number,
    status: String
});

module.exports = mongoose.model('Location', location);
