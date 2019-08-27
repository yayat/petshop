
// app/models/user

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var mongoSchema   = new Schema({
  petshop: {type : String, default : ''},
  name: {type : String, default : ''},
  description: {type : String, default : ''},
  price: {type: Boolean, default: ''}
});
module.exports = mongoSchema;