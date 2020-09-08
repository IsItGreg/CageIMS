const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('./database');


app.use(bodyParser.json());
app.use(cors());

// API
const users = require('/api/Users');
app.use('/api/Users', users);

app.use(express.static(path.join(__dirname, '../build'))); //might need to be changed
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'));
})

const PORT = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server started on port ${port}');
})

// let Item = require('./models/item.model');
// let User = require('./models/user.model');
// let Transaction = require('./models/transaction.model');
// let Employee = require('./models/employee.model');

// var UserController = require('./controllers/UserController');
// app.use('/users', UserController);

// mongoose.connect('mongodb://127.0.0.1:27017/cims', { useNewUrlParser: true });
// const connection = mongoose.connection;

// connection.once('open', function() {
//     console.log("MongoDB database connection establised successfully");
// })


// app.listen(PORT, function() {
//     console.log("Server is running on Port: " + PORT);
// });
