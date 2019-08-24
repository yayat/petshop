
// app/models/user

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var mongoSchema   = new Schema({
    username: {type : String, default : ''},
    name: {type : String, default : ''},
    latitude: {type : String, default : ''},
    longitude: {type : String, default : ''},
    password: {type : String, default : ''},
    isActive: {type : Boolean, default: true}
});
module.exports = mongoSchema;