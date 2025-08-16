const {Router} = require('express'),
  User = require('../models/User');

const userRouter = Router();

userRouter.post('/', async (req, res) => {
  const {username, email} = req.body;
  try {
    const user = new User({
      username,
      email
    });
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({message: "Error creating user", error});
  }
});

userRouter.delete('/:userId', async (req, res) => {
  const {userId} = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.json({message: `User ${user.username} deleted`});
  }
  catch (error) {
    return res.status(500).json({message: "Error deleting user", error});
  }
});

module.exports = userRouter;
