import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';

// Import user model
import User from '../models/userSchema';

// @Description     > Authenticate User
// @Route           > /api/user/auth
// @Access-Control  > Public
export const authenticateUser = async (req, res, next) => {
  try {
    // Pull out the properties from body
    const { username, password } = req.body;

    // Check for empty fields
    if (username === '' || password === '') {
      return res.status(400).json({
        msg: `Invalid credentials!`,
      });
    }

    // Find the user by username
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(409).json({
        msg: `No user found!`,
      });
    }

    // Compare password if it is matching or not
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(409).json({
        msg: `Invalid password!`,
      });
    }

    // Create the token based on user
    const token = await jwt.sign({ id: user._id }, config.get('JWT_KEY'), {
      expiresIn: 3600,
    });

    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    throw error.message;
  }
};

// @Description     > Fetching Authenticated User
// @Route           > /api/auth/user
// @Access-Control  > Private
export const getCurrentUser = async (req, res, next) => {
  try {
    // Find the auth user
    const authUser = await User.findOne({ _id: req.user.id }).exec();

    if (!authUser) {
      return res.status(401).json({
        msg: `Unauthorized!`,
      });
    }

    return res.status(200).json({
      user: authUser,
    });
  } catch (error) {
    throw error.message;
  }
};
