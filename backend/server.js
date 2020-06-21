const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

// let Item = require('./models/item.model');
// let User = require('./models/user.model');
// let Transaction = require('./models/transaction.model');
// let Employee = require('./models/employee.model');

app.use(cors());
app.use(bodyParser.json());

var UserController = require('./controllers/UserController');
app.use('/users', UserController);

mongoose.connect('mongodb://127.0.0.1:27017/cims', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection establised successfully");
})


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});