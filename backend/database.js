const mongoose = require('mongoose');
const connection = "mongodb+srv://dbUser:dbUserPassword@cims-cluster.36vz8.azure.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));