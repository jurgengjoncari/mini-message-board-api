const {Router} = require('express'),
  jwt = require('jsonwebtoken'),
  User = require('../user/User');

const {JWT_SECRET} = process.env

const authRouter = Router();

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
    const {username, email, password} = req.body;

    const user = await User.create({
      username,
      email,
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
