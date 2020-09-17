// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');
// require('./database');


// app.use(bodyParser.json());
// app.use(cors());

// // API
// const users = require('/api/users');
// app.use('/api/users', users);

// app.use(express.static(path.join(__dirname, '../build'))); //might need to be changed
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build'));
// })

// const PORT = process.env.PORT || 5000;
// app.listen(port, () => {
//     console.log('Server started on port ${port}');
// })

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

// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080; // Step 1

const routes = require('./routes/api');

// Step 2
const mongo_uri = "mongodb+srv://dbUser:dbUserPassword@cims-cluster.36vz8.azure.mongodb.net/CageDB?retryWrites=true&w=majority";
mongoose.connect(mongo_uri, {
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


// HTTP request logger
app.use(morgan('tiny'));
app.use('/api', routes);


app.listen(PORT, console.log(`Server is starting at ${PORT}`));