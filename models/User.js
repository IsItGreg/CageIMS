const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    userCode: String,
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    activeTransactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    courses: [String],
    phone: String,
    notes: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, "users");