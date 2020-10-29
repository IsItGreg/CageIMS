const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let transactionSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    item_id: {type: Schema.Types.ObjectId, ref: 'Item'},
    checkedOutDate: Date,
    dueDate: Date,
    checkedInDate:Date,
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema, "transactions");
