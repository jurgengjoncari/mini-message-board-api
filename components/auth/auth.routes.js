const {Router} = require('express'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  User = require('../user/user.model');

const {
  JWT_SECRET = 'local_fallback_secret', 
  FRONTEND_URI
} = process.env

const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: FRONTEND_URI,
    session: true
  }), (req, res) => {
    res.redirect(FRONTEND_URI);
  });

authRouter.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

authRouter.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.status(204).end();
    });
  });
});

authRouter.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;

    const user = await User.findOne({username}).select('+password');

    const isSamePassword = await user.comparePassword(password);

    if (!isSamePassword) {
      return res.status(404).json({message: "Incorrect credentials"});
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h'});

    user.password = undefined;

    res.json({token, user});
  }
  catch (error) {
    return res.status(400).json({error});
  }
});

authRouter.post('/signup', async (req, res) => {
  try {
    const {username, password} = req.body;

    const user = await User.create({
      username,
      password
    });

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h'});

    user.password = undefined;

    res.json({token, user});
  }
  catch (error) {
    return res.status(400).json({error});
  }
});

module.exports = authRouter;
