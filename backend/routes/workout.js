const { Router } = require('express');
const router = Router();
const Workout = require('../models/Workout');

router.post('/:userId', async (req, res) => {
  try{ 
    const owner = req.params.userId;
    const excercises = req.body.map(excercise => {
      return excercise.excercises[0]  
    })
    const workout = new Workout({
        owner,
        excercises
      }
    );
    await workout.save();
    res.status(200).json(workout);
  } catch (error) {
    console.log(error);
    res.status(500).json('Something wrong.Try again');
  }
});

router.get('/:workoutId', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId);
    res.status(200).json(workout);
  } catch (error) {
    res.status(200).json('Something wrong.Try again');
  }
})

module.exports = router;