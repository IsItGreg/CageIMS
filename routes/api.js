const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require("../models/Transaction");

// Transaction Routes
router.get('/transactions', (req, res) => {
    Transaction.find({})
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
    Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(transaction => {
            if (!transaction)
                return res.status(404).send({ message: "Transaction not found with id " + req.params.id });
            res.send(item)
        }).catch(err => {
            if (err.kind === 'ObjectId')
                return res.status(404).send({ message: "Item not found with id " + req.params.id });
            return res.status(500).send({ message: "Error updating item with id " + req.params.id });
        })
})

// Item Routes
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
            data.forEach(user => delete user.password);
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

router.put('/users/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

// Routes
// router.get('/', (req, res) => {

//     BlogPost.find({  })
//         .then((data) => {
//             console.log('Data: ', data);
//             res.json(data);
//         })
//         .catch((error) => {
//             console.log('error: ', error);
//         });
// });

// router.post('/save', (req, res) => {
//     const data = req.body;

//     const newBlogPost = new BlogPost(data);

//     newBlogPost.save((error) => {
//         if (error) {
//             res.status(500).json({ msg: 'Sorry, internal server errors' });
//             return;
//         }
//         // BlogPost
//         return res.json({
//             msg: 'Your data has been saved!!!!!!'
//         });
//     });
// });


// router.get('/name', (req, res) => {
//     const data =  {
//         username: 'peterson',
//         age: 5
//     };
//     res.json(data);
// });



module.exports = router;