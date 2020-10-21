const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const Workout = require('../models/Workout');

router.post('/:userId', async (req, res) => {
    try{ 
      const token = req.headers.authorization;
      // const token = authHeader.authorization && authHeader.authorization.split(" ")[1];
      if(!token) {
        return res.status(403).json('Denied');
      }
      await jwt.verify(token, config.get('jwtSecretKey'), (err, user) => {
        if (err) {
          return res.status(200).json('Denied');
        }
        req.user = { email: user.email, userId: req.params.userId };
      });

      const owner = req.params.userId;

      const excercises = {
        excercises: req.body,
        owner
      };

      const workout = new Workout({ owner, excercises });
      await workout.save();
      // console.log(workout);
      // const { excName, repeats, measurement } = req.body;


      // const owner = req.params.userId;

      // new Workout


      // new Workout({
      //   owner,
      //   exercises: req.body.map((excercise) => {
      //     excercise: excercise._id,
      //     repeats: exercise.
      //   })
      // });
          
        
        
                
    // const { name, measurementType } = req.body;
    // const excercise = new Excercise({ name, measurementType, owner });
    // excercise.save();
    // res.status(200).json({ excercise });

    //   const excercise = new Excercise({ name, measurementType, owner: req.user.userId });
    //   excercise.save();
    //   const email = req.user.email;
    //   const user = await User.findOne({ email });
    //   user.excercises.push(excercise.id);
    //   user.save();
      res.status(200).json('ok');
    } catch (error) {
      console.log(error);
      res.status(500).json('Something wrong.Try again');
    }
  });

module.exports = router;