import {Schema, model, SchemaTypes} from 'mongoose';

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
  }
}, {
    timestamps: true,
  });

export default model('Message', messageSchema);
