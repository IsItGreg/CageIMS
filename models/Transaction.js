const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let transactionSchema = new Schema({

    fname:String,
    lname:String,
    name:String,
    category:String,
    tid: String,
    uid: String,
    iid: String,
    checkedOutDate: String,
    dueDate: String,
    checkedInDate:String,
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema, "transactions");