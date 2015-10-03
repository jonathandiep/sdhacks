var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true }},
  people: { type: Number, required: true},
  host: Boolean,
  location: { type: String, required: true}
})

module.exports = mongoose.model('User', UserSchema);
