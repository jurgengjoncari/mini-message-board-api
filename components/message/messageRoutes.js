const {Router} = require('express'),
  authMiddleware = require('../../middlewares/auth'),
  Message = require('./Message');

const messageRouter = Router();

messageRouter.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    return res.status(500).json({message: "Error fetching messages", error});
  }
});

messageRouter.post('/', authMiddleware, async (req, res) => {
  const {content} = req.body;
  try {
    const message = await Message.create( {
      senderId: req.user._id,
      content
    });
    res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({message: "Error creating message", error});
  }
});

module.exports = messageRouter;
