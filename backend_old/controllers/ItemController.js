const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let Item = require('../models/item.model');


//Create
router.post('/', function (req, res) {
    Item.create({
        name: req.body.name,
        category: req.body.category,
        included: req.body.included,
        note: req.body.note
    },
    function (err, item) {
        if (err) return res.status(500).send("There was a problem adding the item to the database.");
        res.status(200).send(item);
    });
});

//Read
router.get('/', function (req, res) {
    Item.find({}, function (err, items) {
        if (err) return res.status(500).send("There was a problem finding the items.");
        res.status(200).send(items);
    });
});

router.get('/:id', function (req, res) {
    Item.findById(req.params.id, function (err, item) {
        if (err) return res.status(500).send("There was a problem finding the item.");
        if (!item) return res.status(404).send("Item not found.");
        res.status(200).send(item);
    });
});

//Update
router.put('/:id', function (req, res) {
    Item.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, item) {
        if (err) return res.status(500).send("There was a problem updating the item.");
        res.status(200).send(item);
    });
});

//Delete
router.delete('/:id', function (req, res) {
    Item.findByIdAndDelete(req.params.id, function (err, item) {
        if (err) return res.status(500).send("There was a problem deleting the item.");
        res.status(200).send("Item " + item.name + " was deleted.");
    });
});


module.exports = router;
