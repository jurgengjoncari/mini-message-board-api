const {Schema, model} = require('mongoose'),
  bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  creationDate: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

module.exports = mongoose.model('User', userSchema);
