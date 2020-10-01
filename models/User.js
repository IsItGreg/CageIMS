const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    userCode: String,
    transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
    activeTransactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
});

module.exports = mongoose.model('User', userSchema, "users");