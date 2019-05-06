import jwt from 'jsonwebtoken';
import config from 'config';

export default async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({
        msg: `Unauthorized!`,
      });
    }

    // Verify the token
    const decoded = await jwt.verify(token, config.get('JWT_KEY'));

    if (!decoded) {
      return res.status(401).json({
        msg: `Unauthorized!`,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      msg: `Invalid signature!`,
    });
  }
};
