const { Schema, model } = require('mongoose');

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verification: { type: Number, required: true, default: '' },
  confirm: { type: Boolean, required: true, default: false },
  img: { type: String, default: "" }
});

module.exports = model('User', schema);