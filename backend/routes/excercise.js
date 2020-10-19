const { Router } = require('express');
const router = Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { reset } = require('nodemon');
const config = require('config');
const Excercise = require('../models/Excercise');

router.post('/:userId', async (req, res) => {
  try{

    
    const token = req.headers.authorization;
    // const token = authHeader.authorization && authHeader.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json('Denied');
    } 
    await jwt.verify(token, config.get('jwtSecretKey'), (err, user) => {
      if (err) {
        return res.status(200).json('Denied');
      }
      req.user = { email: user.email, userId: req.params.userId };
    });
    const { name, measurementType } = req.body;

    const excercise = new Excercise({ name, measurementType, owner: req.user.userId });
    excercise.save();



    // console.log(excercises);

  




    res.status(200).json({excercise});

    
    // res.status(200).json('All ok');
  } catch (error) {
    console.log(error);
      res.status(500).json('Something wrong.Try again');
  }
});

module.exports = router;