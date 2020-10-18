const { Router } = require('express');
const router = Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const SALT = config.get('salt');

// registration
router.post(
  '/registration',
  [
    check('email', 'Email is not corrected').isEmail(),
    check('password', 'Minimal length of password is 6 symbols').exists().isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    const error = validationResult(req);

    if(!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
        message: 'Registration data is not corrected'
      });
    }
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if(candidate) {
      return res.status(400).json('Such user already exist');
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(200).json({ message: 'User was created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something wrong. Try again.' });
  }
});

//login
router.post(
  '/login',
  [
    check('email', 'Email is not corrected').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists()
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);

      if(!error.isEmpty()) {
        return res.status(400).json({
          error: error.array(),
          message: 'Sign-in is failed'
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if(!user) {
        return res.status(400).json('Such user is not exist');
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(200).json('Login or password is not corrected');
      }
      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecretKey'),
        { expiresIn: '1h' }
      );
      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something wrong. Try again.' });
    }
});

module.exports = router;