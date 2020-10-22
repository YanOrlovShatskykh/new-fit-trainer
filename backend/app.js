const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const { urlencoded } = require('body-parser');
const PORT = config.get('port') || 3000;
const mongoUri = config.get('mongoUri');
const auth = require('./middlewares/auth');


app.use(express.json());
app.use(express({ urlencoded: true }));

// for postman
const cors = require('cors');
app.use(cors());

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

// routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/excercise', auth, require('./routes/excercise'));
app.use('/api/workout', auth, require('./routes/workout'));