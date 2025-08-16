const {Schema, model, SchemaTypes} = require('mongoose');

const messageSchema = new Schema({
  senderId: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  },
  recipientId: {
    type: SchemaTypes.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Message', messageSchema);
