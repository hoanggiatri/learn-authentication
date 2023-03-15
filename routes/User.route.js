const express = require("express");
const createError = require("http-errors");
const route = express.Router();

const User = require('../models/User.model');
const { userValidate } = require('../helpers/validation')
const { signAccessToken, verifyAccessToken, signRefreshToken } = require('../helpers/jwt_service');


route.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userValidate(req.body);
    console.log(`:::::::error validation`, error);
    if (error) {
      throw createError(error.details[0].message)
    }

    const isExist = await User.findOne({
      email
    });

    if (isExist) {
      throw createError.Conflict(`${email} already exists`)
    }

    const user = new User({
      email,
      password
    })

    const savedUser = await user.save();

    return res.json({
      status: 'okay',
      elements: savedUser
    })
  } catch (err) {
    next(err);
  }

})

route.post('/refresh-token', (req, res, next) => {
  res.send('function refresh')
})

route.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userValidate(req.body);
    console.log(`:::::::error validation`, error);
    if (error) {
      throw createError(error.details[0].message)
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createError.NotFound('User not registered')
    }

    const isValid = await user.isCheckPassword(password);
    if (!isValid) {
      throw createError.Unauthorized('Invalid password');
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.json({
      accessToken,
      refreshToken
    })

  } catch (err) {
    next(err);
  }
})

route.post('/logout', (req, res, next) => {
  res.send('function logout')
})

route.get('/getlists', verifyAccessToken, (req, res, next) => {
  console.log(req.headers)
  const listUsers = [
    {
      email: 'abc@gmail.com'
    },
    {
      email: 'abc1@gmail.com'
    }
  ]
  res.json({
    listUsers
  })
})

module.exports = route