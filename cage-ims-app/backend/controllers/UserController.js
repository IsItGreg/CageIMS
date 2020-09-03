const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let User = require('../models/user.model');


//Create
router.post('/', function (req, res) {
    User.create({
        name: {
            first: req.body.name.first,
            last: req.body.name.last
        },
        email: req.body.email,
        umlId: req.body.umlId
    },
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the user to the database.");
        res.status(200).send(user);
    });
});

//Read
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("User not found.");
        res.status(200).send(user);
    });
});

//Update
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

//Delete
router.delete('/:id', function (req, res) {
    User.findByIdAndDelete(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User " + user.name.first + " " + user.name.last + " was deleted.");
    });
});


module.exports = router;
