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

// const validateRegisterInput = require("../validation/register");
// const validateLoginInput = require("../validation/login");
// const validateResetInput = require("../validation/reset");

const Item = require('../models/Item');
const mongoose = require('mongoose');


getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
    }
    return null;
}


////////////////////////////////////   Item Routes   //////////////////////////////////////////////////////
router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    Item.aggregate([
        {
            $lookup:
            {
                from: "transactions",
                localField: "_id",
                foreignField: "item_id",
                as: "transactions",
            }
        },
        {
            $project: 
            {
                _id : "$_id",
                transactions: "$transactions",
                courses: "$courses",
                name: "$name",
                iid: "$iid",
                serial: "$serial",
                category: "$category",
                notes: "$notes",
                brand: "$brand",
                createdAt:"$createdAt",
                activeTransaction: { 
                    $filter : {
                        input: "$transactions",
                        as : "activeTransaction",
                        cond : {
                            $eq: ["$$activeTransaction.checkedInDate",null]
                        }
                    }
                },
            }
        },
        {$unwind:{ path: "$activeTransaction",preserveNullAndEmptyArrays: true }},
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});

router.get('/available', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    Item.aggregate([
        {
            $lookup:
            {
                from: "transactions",
                localField: "_id",
                foreignField: "item_id",
                as: "transactions",
            }
        },
        {
            $project: {
                _id : "$_id",
                transactions: "$transactions",
                courses: "$courses",
                name: "$name",
                iid: "$iid",
                serial: "$serial",
                category: "$category",
                notes: "$notes",
                brand: "$brand",
                createdAt:"$createdAt",
                activeTransaction: {
                    $filter : {
                        input: "$transactions",
                        as : "activeTransaction",
                        cond : {
                            $eq: ["$$activeTransaction.checkedInDate",null]
                        }
                    }
                }
            }
        },
    ])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
        });
});


router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    const newItem = new Item(req.body);
    newItem.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new Item" });
            return;
        }
        return res.json({ msg: "Item saved" });
    })
})

router.put('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    var token = getToken(req.headers);
    if (!token) return res.status(401).send({success:false, msg:"Unauthorized."});
    Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(item => {
            if (!item)
                return res.status(404).send({ message: "Item not found with id " + req.params.id });
            res.send(item)
        }).catch(err => {
            if (err.kind === 'ObjectId')
                return res.status(404).send({ message: "Item not found with id " + req.params.id });
            return res.status(500).send({ message: "Error updating item with id " + req.params.id });
        })
})



module.exports = router;