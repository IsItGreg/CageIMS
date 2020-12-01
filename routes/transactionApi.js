const express = require('express');
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const crypto = require("crypto");

//const fs = require('fs');
// const keys = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(keys.SG_API_KEY);

// const keys = require("../../config/keys");

// const validateRegisterInput = require("../validation/register");
// const validateLoginInput = require("../validation/login");
// const validateResetInput = require("../validation/reset");

const Transaction = require("../models/Transaction");
const { Types } = require('mongoose');

/////////////////////////////////////////////// Transaction Routes /////////////////////////////////////////////////
router.get('/', (req, res) => {
    Transaction.aggregate([
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" },
        { $unset: ["user.password", "user.resetPasswordExpires", "user.resetPasswordToken"] }
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.post('/', (req, res) => {
    const newTransaction = new Transaction(req.body);
    newTransaction.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new Item" });
            return;
        }
        return res.json({ msg: "Item saved" });
    })
})

router.put('/:id', (req, res) => {
    Transaction.findOne({ _id: req.params.id }, function (err, transaction) {
        transaction.checkedInDate = req.body.checkedInDate;
        transaction.save();
    })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
})

router.put('/multipleTransactions/test', (req, res) => {
    req.body.forEach((transactionIter) =>
        Transaction.findOne({ _id: transactionIter._id }, function (err, transaction) {
            transaction.checkedInDate = transactionIter.checkedInDate;
            transaction.save();
        })
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
            })
    );
})

router.post('/postMultipleTransactions/test', (req, res) => {
    req.body.forEach((transactionIter) =>{
        let newTransaction = new Transaction(transactionIter);
        newTransaction.save((error) => {
            if (error) {
                res.status(500).json({ msg: "Err: couldn't save new Item" });
                return;
            }
        })
    });
    return res.json({ msg: "Item saved" });
})


router.get('/findbyuser/:id', (req, res) => {
    Transaction.aggregate([
        {
            "$match": {
                "$and": [
                    { "user_id": Types.ObjectId(req.params.id) },
                    { "checkedInDate": null },
                ]
            }
        },
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" },
        { $unset: ["user.password", "user.resetPasswordExpires", "user.resetPasswordToken"] }
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.get('/findbyuserall/:id', (req, res) => {
    Transaction.aggregate([
        {
            "$match": {
                "$and": [
                    { "user_id": Types.ObjectId(req.params.id) },
                    { "checkedInDate":{$ne : null} },
                    
                ]
            }
        },
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" },
        { $unset: ["user.password", "user.resetPasswordExpires", "user.resetPasswordToken"] }
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.get('/findbyuserdue/:id', (req, res) => {
    Transaction.aggregate([
        {
            "$match": {
                "$and": [
                    { "user_id": Types.ObjectId(req.params.id) },
                    { "checkedInDate": null },
                ]
            }
        },
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" },
        { $unset: ["user.password", "user.resetPasswordExpires", "user.resetPasswordToken"] }
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.get('/findbyitemdue/:id', (req, res) => {
    Transaction.aggregate([
        {
            "$match": {
                "$and": [
                    { "item_id": Types.ObjectId(req.params.id) },
                    { "checkedInDate": null },
                ]
            }
        },
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" },
        { $unset: ["user.password", "user.resetPasswordExpires", "user.resetPasswordToken"] }
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});


router.get('/findbyitemall/:id', (req, res) => {
    Transaction.aggregate([
        {
            "$match": {
                "$and": [
                    { "item_id": Types.ObjectId(req.params.id) },
                    { "checkedInDate":{$ne : null} },
                ]
            }
        },
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" },
        { $unset: ["user.password", "user.resetPasswordExpires", "user.resetPasswordToken"] }
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});




module.exports = router;