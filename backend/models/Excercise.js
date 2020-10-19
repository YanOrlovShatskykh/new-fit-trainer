const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true },
  order: { type: Number },
  measurementType: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: 'User' },
  workout: { type: Types.ObjectId, ref: 'Workout' }
});

module.exports = model('Excercise', schema);