const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    name: String,
    category: String,
    included: [String],
    issues: [{
        note: String,
        dateCreated: Date,
        dateClosed: Date,
        createdBy: {type: Schema.Types.ObjectId, ref: 'Employee'},
        closedBy: {type: Schema.Types.ObjectId, ref: 'Employee'}
    }],
    note: String,
    whoHas: {type: Schema.Types.ObjectId, ref: 'User'},
    transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
});

module.exports = mongoose.model('Item', Item);