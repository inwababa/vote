const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();

const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//enable CORS
app.use(cors());

app.use('/poll', poll)

const port = 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

//Start sever
app.listen(port, () => console.log(`Server started on port ${port}`));