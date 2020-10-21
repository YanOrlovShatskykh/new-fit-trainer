const { Module } = require('module');
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  owner: { type: Types.ObjectId, ref: 'User' },
  excercises: [{ 
    excercise: { type: Types.ObjectId, ref: 'Excercise' },
    repeats: 0,
    measurement: 0
  }]
});

module.exports = model('Workout', schema);