const express = require('express'),
  router = express.Router(),
  {messages} = require('../../models/db');

const options = {
  title: 'Mini Message board',
  messages: messages
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', options);
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
