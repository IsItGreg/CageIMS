const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Employee = new Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    passHash: String,
    isAdmin: Boolean
})

module.exports = mongoose.model('Employee', Employee);