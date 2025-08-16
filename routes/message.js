const {Router} = require('express'),
  {Message} = require('../models/Message');

const messageRouter = Router();

messageRouter.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    return res.status(500).json({message: "Error fetching messages", error});
  }
});

messageRouter.post('/', async (req, res) => {
  const {senderId, content} = req.body;
  try {
    const message = new Message( {
      senderId,
      content
    });
    await message.save();
    res.status(201).json({message});
  } catch (error) {
    return res.status(500).json({message: "Error creating message", error});
  }
});
