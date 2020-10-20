const { Module } = require('module');
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  repeats: { type: Number },
  measurement: { type: String, required: true },
  user: { type: Types.ObjectId, ref: 'User' },
  exercises: [{ type: Types.ObjectId, ref: 'Excercise' }]

});

module.exports = model('Workout', schema);