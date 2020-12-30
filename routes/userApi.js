const express = require('express');
const router = express.Router();

const passport = require('passport');
require('../config/passport')(passport);
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


getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
    }
    return null;
}

// User Routes
router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    User.find({}).select("-password -resetPasswordExpires -resetPasswordToken")
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.get('/:ucode', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    User.findOne({ userCode: req.params.ucode }).select("-password -resetPasswordExpires -resetPasswordToken")
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.post('/find', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    User.findOne({ email: req.body.email }).select("-password -resetPasswordExpires -resetPasswordToken")
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    const newUser = new User(req.body);
    newUser.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new User" });
            return;
        }
        return res.json({ msg: "User saved" });
    })
})

router.put('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
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

router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    User.findByIdAndDelete(req.params.id).select("-password -resetPasswordExpires -resetPasswordToken")
        .catch(err => {
            if (err.kind === 'ObjectId')
                return res.status(404).send({ message: "User not found with id " + req.params.id });
            return res.status(500).send({ message: "Error updating user with id " + req.params.id });
        })
})


module.exports = router;