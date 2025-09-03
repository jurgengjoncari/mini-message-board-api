const express = require('express'),
  router = express.Router(),
  authMiddleware = require("../../middlewares/auth"),
  Message = require('../message/message.model');

/* GET home page. */
router.get('/', async function (req, res) {
  try {
    const messages = await Message.find()
      .sort({createdAt: 1})
      .populate('senderId', 'username')
      .exec();
    res.json(messages);
  }
  catch (error) {
    res.status(500).json({error});
  }
});

/*POST request */
router.post('/', authMiddleware, async function (req, res) {
  const {content} = req.body;
  try {
    const {id} = await Message.create({
      senderId: req.user._id,
      content
    });

    const message = await Message.findById(id).populate('senderId', 'username');

    res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({message: "Error creating message", error});
  }
});

module.exports = router;
