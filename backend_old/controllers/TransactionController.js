const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let Transaction = require('../models/transaction.model');


//Create
router.post('/', function (req, res) {
    Transaction.create({
        groupId: req.body.groupId,
        userId: req.body.userId,
        itemId: req.body.itemId,
        checkoutDate: req.body.checkoutDate,
        dueDate: req.body.dueDate,
        notes: req.body.notes,
        checkoutBy: req.body.checkoutBy,
        isReturned: req.body.isReturned
    },
    function (err, transaction) {
        if (err) return res.status(500).send("There was a problem adding the transaction to the database.");
        res.status(200).send(transaction);
    });
});

//Read
router.get('/', function (req, res) {
    Transaction.find({}, function (err, transactions) {
        if (err) return res.status(500).send("There was a problem finding the transactions.");
        res.status(200).send(transactions);
    });
});

router.get('/:id', function (req, res) {
    Transaction.findById(req.params.id, function (err, transaction) {
        if (err) return res.status(500).send("There was a problem finding the transaction.");
        if (!transaction) return res.status(404).send("Transaction not found.");
        res.status(200).send(transaction);
    });
});

//Update
router.put('/:id', function (req, res) {
    Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, transaction) {
        if (err) return res.status(500).send("There was a problem updating the transaction.");
        res.status(200).send(transaction);
    });
});

//Delete
router.delete('/:id', function (req, res) {
    Transaction.findByIdAndDelete(req.params.id, function (err, transaction) {
        if (err) return res.status(500).send("There was a problem deleting the transaction.");
        res.status(200).send("Transaction " + transaction._id + " was deleted.");
    });
});


module.exports = router;
