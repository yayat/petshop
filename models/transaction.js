
// app/models/user

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var mongoSchema   = new Schema({
    customer: {type : String, default : ''},
    petshop: {type : String, default : ''},
    courier: {type : String, default : ''},
    address: {type : String, default : ''},
    latitude: {type : String, default : ''},
    longitude: {type : String, default : ''},
    groomings: {type: Array, default: []},
    clinics:  {type: Array, default: []},
    hotel:  {type: Array, default: []},
});
module.exports = mongoSchema;