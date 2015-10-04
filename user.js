var mongoose = require('mongoose')
require('mongoose-long')(mongoose);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, unique: true},
  people: { type: Number, required: true},
  host: Boolean,
  location: { type: String, required: true},
  time: Date
})

/*
var getUsers = function() {
  var res = null;
  User.find({}, 'username people host location', function(err, docs) {
    if (err) console.log(err);

    console.log(docs);
  });
  return res;
}
*/

module.exports = mongoose.model('User', UserSchema);
