const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name:  
    {
        first: String,
        last: String
    },
    email: String,
    umlId: String,
    transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
    activeTransactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
})

module.exports = mongoose.model('User', userSchema, "users");