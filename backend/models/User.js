const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verifCode: { type: Number, default: '' },
  confirm: { type: Boolean, default: false },
  img: { type: String, default: '' },
  // excercises: [{ type: Types.ObjectId, ref: 'Excercise' }],
  // workouts: [{ type: Types.ObjectId, ref: 'Workout' }]
});

module.exports = model('User', schema);