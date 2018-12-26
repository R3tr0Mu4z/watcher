var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var account = new Schema({
    name: String,
    email: String,
    password: String,
    token: String,
    main_phone: ObjectId,
    requested_phones:[{type: ObjectId, ref:'Phone'}],
    phones:[{type: ObjectId, ref:'Phone'}]
});

module.exports = mongoose.model('Account', account);
