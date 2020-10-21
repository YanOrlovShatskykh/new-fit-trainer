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
    const verifCode = Math.floor(Math.random() * 10000);
    const user = new User({ email, password: hashedPassword, verifCode });
    await user.save();
    const verUri = `http://localhost:${config.get('port')}/api/auth/verification?email=${user.email}&verifCode=${verifCode}`;
    console.log('Link for verification:', verUri);
    res.status(200).json({ message: 'User was created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something wrong. Try again.' });
  }
});

//verification
router.post('/verification', async (req, res) => {
  try {
    const { email, verifCode } = req.query;
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json('Such user is not exist');
    }
    const { verifCode: bdVerifCode } = user;

    // if(!bdVerifCode) {
    //   return res.status(400).json('You already have been verificated');
    // }
  
    if(user.verifCode != verifCode) {
      return res.status(400).json('Wrong verification code');
    }  
    await user.updateOne({ confirm: true });

    const token = jwt.sign(
      { email, userId: user.id },
      config.get('jwtSecretKey'),
      { expiresIn: '24h' }
    );
    // await user.updateOne({ verifCode: '' });
    res.status(200).json({ token, userId: user.id, message: 'Your account is verificated now.' });
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
    check('password', 'Password length must be at least 6 characters').exists().isLength({ min: 6 })
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

      const token = req.headers.authorization;
      
      // const token = authHeader.authorization && authHeader.authorization.split(" ")[1];
      if(!token) {
        return res.status(403).json('Denied');
      }
      await jwt.verify(token, config.get('jwtSecretKey'), (err, user) => {
        if (err) {
          console.log(err);
          return res.status(200).json('Denied');
        }
        req.user = { email: user.email };
      });

      const { email, password, verifCode } = req.body;
      const user = await User.findOne({ email });
      
      if(!user) {
        return res.status(400).json('Such user is not exist');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      const { confirm } = user;
      
      if(!isMatch) {
        return res.status(200).json('Login or password is not corrected');
      }
      
      if(!confirm) {
        return res.status(403).json('You not confirmed your email.');
      }
      res.status(200).json('Welcome');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something wrong. Try again.' });
    }
});

module.exports = router;