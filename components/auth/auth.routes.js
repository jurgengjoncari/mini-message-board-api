const {Router} = require('express'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  User = require('../user/user.model');

const {JWT_SECRET, ORIGIN} = process.env

const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

authRouter.get('/google/callback', passport.authenticate('google', {
  session: false
}), async ({user}, res) => {
  try {
    const {firstName, displayName, email, username, _id, lastName, profilePicture} = user;
    const token = jwt.sign({
      userId: _id
    }, JWT_SECRET, {
      expiresIn: '1h'
    });

    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    };
    res.cookie('jwt', token, cookieOptions);
    res.cookie('user', JSON.stringify({
      id: _id,
      firstName,
      lastName,
      email,
      profilePicture,
      username,
      displayName,
    }), cookieOptions);

    res.redirect(ORIGIN);
  } catch (error) {
    return res.status(400).json({error});
  }
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
