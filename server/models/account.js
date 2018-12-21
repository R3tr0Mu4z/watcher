var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var account = new Schema({
    name: String,
    password: String
});

module.exports = mongoose.model('Account', account);
