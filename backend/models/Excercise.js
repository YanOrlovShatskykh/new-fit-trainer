const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true },
  measurementType: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: 'User' }
});

module.exports = model('Excercise', schema);