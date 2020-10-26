const { Router } = require('express');
const router = Router();
const Excercise = require('../models/Excercise');
const User = require('../models/User');

// localhost:3000/api/excercise/
router.post('/:userId', async (req, res) => {
  try{
    const owner = req.params.userId;
    const { name, measurementType } = req.body;
    const excercise = new Excercise({ name, measurementType, owner });
    excercise.save();
    res.status(200).json({ excercise });
  } catch (error) {
    console.log(error);
    res.status(500).json('Something wrong.Try again');
  }
});

// router.delete('/:id', async(req, res) => {
//   try {
//     const excId = req.params.id;
//     const email = req.user.email;
//     await Excercise.findByIdAndDelete({ _id: excId });
//     const user = await User.findOne({ email });
//     user.excercises.pull({ _id: excId });
//     user.save();
//     res.status(200).json(`Your excercise with id: ${excId} was deleted succecfully`);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json('Something wrong.Try again');
//   }
// });

router.delete('/', async (req, res) => {
  try {
    const id = req.body._id;
    await Excercise.findByIdAndDelete(id);
    res.status(200).json('ok');
  } catch (error) {
    res.status(400).json('Somenthing wrong');
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const excercises = await Excercise.find({ owner: userId });
    res.status(200).json(excercises);
  } catch (error) {
    console.log(error);
    res.status(400).json('Something wrong.Try again');
  }
});

router.put('/', async (req, res) => {
  try {
    // const { excercises } = await User.findOne({ email }).populate('excercises');
    const updExc = req.body;

    for await (let excercise of updExc) {
      data = {
        name: excercise.name,
        measurementType: excercise.measurementType
      };
      await Excercise.findByIdAndUpdate(excercise._id, data);
    }
    res.status(200).json('Ok');
  } catch (error) {
    console.log(error);
    res.status(200).json('Something wrong.Try again');
  }
});

module.exports = router;