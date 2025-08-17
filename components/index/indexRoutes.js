const express = require('express'),
  router = express.Router(),
  Message = require('../message/Message');

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

/* GET form. */
router.get('/new', function(req, res) {
  res.render('form', {title: "Form"});
});

/*POST request */
router.post('/new', function (req, res) {
  const {message: text, author} = req.body;

  const message = {
    text: text,
    author: author,
    added: new Date()
  };

  messages.push(message);

  res.redirect('/')
})

module.exports = router;
