import jwt from 'jsonwebtoken';
import User from '../components/user/user.model.js';

const {JWT_SECRET} = process.env;

export default async (req, res, next) => {
  // 1. Check for an active session (from Google login)
  if (req.isAuthenticated() && req.user) {
    return next();
  }

  // 2. If no session, check for a JWT token (from local login)
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({error: "User is not authenticated or Authorization header is missing"});
  }

  const token = authorization.split(' ')[1];

  try {
    const {userId} = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(userId).select(['-password', '-__v']);

    if (!user) {
      return res.status(401).json({error: "User not found"});
    }

    req.user = user;

    next();
  }
  catch (error) {
    return res.status(401).json({error: error});
  }
}
