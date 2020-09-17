const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Transaction = new Schema({
    groupId: Number,
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    itemId: {type: Schema.Types.ObjectId, ref: 'Item'},
    checkoutDate: Date,
    dueDate: Date,
    notes: String,
    checkoutBy: {type: Schema.Types.ObjectId, ref: 'Employee'},
    isReturned: Boolean,
    returnDate: Date,
    returnBy: {type: Schema.Types.ObjectId, ref: 'Employee'},
    returnNotes: String
})

module.exports = mongoose.model('Transaction', Transaction);