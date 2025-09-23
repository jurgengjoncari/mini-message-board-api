const {Router} = require('express'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  User = require('../user/user.model');

const {JWT_SECRET, FRONTEND_URI, NODE_ENV, BACKEND_HOSTNAME} = process.env

const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

authRouter.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { failureRedirect: FRONTEND_URI }, (err, user) => {
    if (err || !user) return res.redirect(FRONTEND_URI);

    // Log in the user and set the session cookie
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });

      // Redirect to frontend after session is set
      res.redirect(FRONTEND_URI);
    });
  })(req, res, next);
});

authRouter.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

authRouter.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Could not log out user', error: err });
      res.clearCookie('connect.sid'); // The name of the cookie set by express-session
      res.status(200).json({ message: 'Logged out successfully' });
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
