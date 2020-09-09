const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', (req, ress) => {
    User.find()
        .then(users => ress.json(users))
        .catch(err => console.log(err))
});
router.get('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(400).json({ email: "User not found" });
        } else {
            res.status(200).send(user);
        }
    })
})

router.post('/', (req, res) => {
    const { name, email } = req.body;
    const newUser = new User({
        name: name, email: email
    });
    newUser.save()
        .then(() => res.json({
            message: "Created account sucessfully"
        }))
        .catch(err => res.status(400).json({
            "error": err,
            "message": "Error creating account"
        }))
})

module.exports = router;