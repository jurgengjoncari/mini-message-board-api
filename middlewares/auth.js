const jwt = require('jsonwebtoken'),
  User = require('../components/user/User'),
  {JWT_SECRET} = process.env;

module.exports = async (req, res, next) => {
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({error: "Authorization header is missing"});
  }

  const token = authorization.split(' ')[1];

  try {
    const {userId} = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(userId).select(['-password', '-__v']); // Exclude password and version from the user object

    if (!user) {
      return res.status(401).json({error: "User not found"});
    }

    req.user = user;
    next();
  }
  catch (error) {
    return res.status(401).json({error: "Invalid token"});
  }
}
