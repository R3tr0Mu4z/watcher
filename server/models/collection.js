var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var collection = new Schema({
    title: {type: String, default: "My Phones"},
    phones:[{type: ObjectId, ref:'Phone'}]
});

module.exports = mongoose.model('Collection', collection);
