const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const { urlencoded } = require('body-parser');
const PORT = config.get('port') || 3000;
const mongoUri = config.get('mongoUri');


app.use(express.json());
app.use(express({urlencoded: true}));

// for postman
const cors = require('cors');
app.use(cors());

// routes
app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/')

// connected to db
async function start() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('Conected to db');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }
};

start();


