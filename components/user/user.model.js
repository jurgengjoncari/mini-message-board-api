const {Schema, model} = require('mongoose'),
  bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  displayName: String,
  username: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    sparse: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    },
    minlength: 8,
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  profileUrl: String,
  profilePicture: String,
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    }
    catch (error) {
      next(error);
    }
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  catch (error) {
    throw new Error(error);
  }
}

module.exports = model('User', userSchema);
