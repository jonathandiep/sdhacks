var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, unique: true},
  people: { type: Number, required: true},
  host: Boolean,
  location: { type: String, required: true},
  time: Date
})

module.exports = mongoose.model('User', UserSchema);
