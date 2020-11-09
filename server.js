// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require("body-parser");
const passport = require("passport");

const fs = require('fs');
const keys = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
console.log(keys);

const app = express();
const PORT = process.env.PORT || 8080; // Step 1

const routes = require('./routes/api');
const transactionRoute = require('./routes/transactionApi');
const itemRoute = require('./routes/itemApi');
const userRoute = require('./routes/userApi');

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Step 2
mongoose.connect(keys.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!!!!');
});

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Step 3

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// HTTP request logger
app.use(morgan('tiny'));
app.use('/api', routes);
app.use('/transactions',transactionRoute);
app.use('/items',itemRoute);
app.use('/users',userRoute);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));