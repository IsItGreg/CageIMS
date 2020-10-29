const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const fs = require('fs');
const keys = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(keys.SG_API_KEY);

// const keys = require("../../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateResetInput = require("../validation/reset");

const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require("../models/Transaction");
const { Types } = require('mongoose');

/////////////////////////////////////////////// Transaction Routes /////////////////////////////////////////////////
router.get('/transactions', (req, res) => {
    Transaction.aggregate([
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" }
    ])
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/transactions', (req, res) => {
    const newTransaction = new Transaction(req.body);
    newTransaction.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new Item" });
            return;
        }
        return res.json({ msg: "Item saved" });
    })
})

router.put('/transactions/:id', (req, res) => {
    Transaction.findOne({ _id: req.params.id }, function (err, transaction) {
        transaction.checkedInDate = req.body.checkedInDate;
        transaction.save();
    })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
})

router.get('/transactions/findbyuser/:id', (req, res) => {
    console.log(req.params);
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
        { $unwind: "$user" }
    ])
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/transactions/findbyuserall/:id', (req, res) => {
    console.log(req.params);
    Transaction.aggregate([
        {
            "$match": {
                "$and": [
                    { "user_id": Types.ObjectId(req.params.id) },
                ]
            }
        },
        { $lookup: { from: "items", localField: "item_id", foreignField: "_id", as: "item" } },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$item" },
        { $unwind: "$user" }
    ])
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});


//.///////////////////////////////// Item Routes //////////////////////////////////////////////////////
router.get('/items', (req, res) => {
    Item.find({})
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/items/available', (req, res) => {
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
                id : "$_id",
                transactions: "$transactions",
                courses: "$courses",
                name: "$name",
                iid: "$iid",
                serial: "$serial",
                category: "$category",
                notes: "$notes",
                brand: "$brand",
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
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});


router.post('/items', (req, res) => {
    const newItem = new Item(req.body);
    newItem.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new Item" });
            return;
        }
        return res.json({ msg: "Item saved" });
    })
})

router.put('/items/:id', (req, res) => {
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


// User Routes
router.get('/users', (req, res) => {
    User.find({})
        .then((data) => {

            data.forEach(user => user.password = null);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/users/:ucode', (req, res) => {
    User.findOne({ userCode: req.params.ucode })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/users/find', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/users', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((error) => {
        if (error) {
            res.status(500).json({ msg: "Err: couldn't save new User" });
            return;
        }
        return res.json({ msg: "User saved" });
    })
})

router.put('/users/', (req, res) => {
    console.log(req);
    User.findByIdAndUpdate(req.body._id, req.body, { new: true })
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

router.delete('/users/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .catch(err => {
            if (err.kind === 'ObjectId')
                return res.status(404).send({ message: "User not found with id " + req.params.id });
            return res.status(500).send({ message: "Error updating user with id " + req.params.id });
        })
})



// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname
                };
                // Sign token
                jwt.sign(
                    payload,
                    "secret",
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

router.post("/forgotPassword", (req, res) => {
    if (req.body.email === "") {
        res.status(400).send("Email required");
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user === null) {
            res.status(403).send("User not found");
        } else {
            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            user.save()
                .then(() => {
                    const msg = {
                        to: user.email,
                        from: 'Cage_IMS_no_reply@gsme.dev',
                        subject: 'CageIMS Password Reset',
                        text: 'You are receiveing this email because you (or someone else) has requested to reset the password for your CageIMS account.\n\n'
                            + 'If you wish to reset your password, please click on the following link or paste it into your browser:\n\n'
                            + `http://localhost:3000/#/reset/${token}\n\n`
                            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                            + 'The link will expire in 60 minutes.'
                    }
                    sgMail
                        .send(msg)
                        .then(() => { console.log('Email sent'); })
                        .catch((err) => { console.log(err); });
                }).catch(err => console.log(err));
        }
    });
});

router.put("/resetPassword", (req, res) => {
    console.log(req.body);
    User.findOne({
        resetPasswordToken: req.body.token,
        // resetPasswordExpires: {
        //     $gt: Date.now(),
        // },
    }).then(user => {
        if (user == null) {
            console.log('Password reset link invalid or has expired');
            res.json('Password reset link invalid or has expired');
        } else {
            console.log(user);
            const { errors, isValid } = validateResetInput(req.body);
            console.log(errors);
            if (!isValid) {
                return res.status(400).json(errors);
            }
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.resetPasswordExpires = null;
                    user.resetPasswordToken = null;
                    user.save();
                });
            });
        }
    }).then(() => {
        return res.json({
            success: true,
        });
    })
})



module.exports = router;