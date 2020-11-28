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

const User = require('../models/User');
const { Types } = require('mongoose');


// User Routes
router.get('/', (req, res) => {
    User.find({}).select("-password -resetPasswordExpires -resetPasswordToken")
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.get('/:ucode', (req, res) => {
    User.findOne({ userCode: req.params.ucode }).select("-password -resetPasswordExpires -resetPasswordToken")
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.post('/find', (req, res) => {
    User.findOne({ email: req.body.email }).select("-password -resetPasswordExpires -resetPasswordToken")
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new User" });
            return;
        }
        return res.json({ msg: "User saved" });
    })
})

router.put('/', (req, res) => {
    User.findByIdAndUpdate(req.body._id, req.body, { new: true }).select("-password -resetPasswordExpires -resetPasswordToken")
        .then(user => {
            if (!user)
                return res.status(404).send({ message: "User not found with id " + req.params.id });
            res.send(user)
        }).catch(err => {
            if (err.kind === 'ObjectId')
                return res.status(404).send({ message: "User not found with id " + req.params.id });
            return res.status(500).send({ message: "Error updating user with id " + req.params.id });
        })
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).select("-password -resetPasswordExpires -resetPasswordToken")
        .catch(err => {
            if (err.kind === 'ObjectId')
                return res.status(404).send({ message: "User not found with id " + req.params.id });
            return res.status(500).send({ message: "Error updating user with id " + req.params.id });
        })
})


module.exports = router;