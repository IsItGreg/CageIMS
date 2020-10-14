const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
    name: String,
    brand: String,
    serial: String,
    category: String,
    iid: String,
    transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
    activeTransactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
    courses: [String],
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema, "items");