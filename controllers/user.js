import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';

import User from '../models/userSchema';
import {
  validateEmptyFields,
  validateAge,
  validatePassword,
  validateFirstName,
  validateLastName,
  validateEmail,
} from '../validations/validate';

// @Description     > Fetching All Users
// @Route           > /api/users
// @Access-Control  > Public
export const getUsers = async (req, res, next) => {
  try {
    // Find all of user
    const users = await User.find()
      .sort({ date: -1 })
      .select(' -password -__v ')
      .exec();

    if (users.length < 1) {
      return res.status(409).json({
        msg: `No users found!`,
      });
    }

    // Map all users
    const usersList = users.map(user => ({ ...user._doc }));

    return res.status(200).json({
      users: usersList,
    });
  } catch (error) {
    throw error.message;
  }
};

// @Description     > Adding User
// @Route           > /api/users
// @Access-Control  > Public
export const addUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      age,
      email,
      username,
      password,
      cPassword,
    } = req.body;

    // Check for empty fields
    if (
      !validateEmptyFields(
        firstName,
        lastName,
        age,
        email,
        username,
        password,
        cPassword
      )
    ) {
      return res.status(400).json({
        msg: `Please fill out all fields!`,
      });
    }

    // Check for valid first name
    if (!validateFirstName(firstName)) {
      return res.status(400).json({
        msg: `Invalid first name!`,
      });
    }

    // Check for valid last name
    if (!validateLastName(lastName)) {
      return res.status(400).json({
        msg: `Invalid last name!`,
      });
    }

    // Check for valid age
    if (!validateAge(age)) {
      return res.status(400).json({
        msg: `Invalid age!`,
      });
    }

    // Check for valid email id
    if (!validateEmail(email)) {
      return res.status(400).json({
        msg: `Invalid email id!`,
      });
    }

    // Check for matching passwords
    if (!validatePassword(password, cPassword)) {
      return res.status(400).json({
        msg: `Password is not match!`,
      });
    }

    // Check for existing email id
    const eUser = await User.findOne({ email }).exec();

    if (eUser) {
      return res.status(409).json({
        msg: `User already exist!`,
      });
    }

    // Check for existing username
    const uUser = await User.findOne({ username }).exec();

    if (uUser) {
      return res.status(409).json({
        msg: `Invalid username!`,
      });
    }

    // Hashing the password
    const hashedPwd = await bcrypt.hash(password, 12);

    if (!hashedPwd) {
      return res.status(500).json({
        msg: `Something went wrong while hashing the password!`,
      });
    }

    // Define the user object
    const newUser = User({
      _id: new mongoose.Types.ObjectId(),
      first_name: firstName,
      last_name: lastName,
      age,
      email,
      username,
      password: hashedPwd,
    });

    // Adding the new user
    const user = await newUser.save();

    if (user) {
      // Create the token based on user credentials
      const token = await jwt.sign({ id: user._id }, config.get('JWT_KEY'), {
        expiresIn: 3600,
      });

      return res.status(201).json({
        token,
        user,
      });
    }
  } catch (error) {
    throw error.message;
  }
};

// @Description     > Deleting User
// @Route           > /api/users/:id
// @Access-Control  > Private
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user if the user exist or not
    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      return res.status(409).json({
        msg: `No user found!`,
      });
    }

    // Delete the user if exist
    const deletedUser = await User.deleteOne({ _id: id });

    if (deletedUser) {
      return res.status(200).json({
        msg: `User successfully deleted!`,
      });
    }
  } catch (error) {
    throw error.message;
  }
};
