const express = require('express');

const router = express.Router();

const User = require('../models/User');
// const BlogPost = require('../models/blogPost');

// User Routes
router.post('/users/find', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/users', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((error) => {
        if(error) {
            res.status(500).json({ msg: "Err: couldn't save new User" });
            return;
        }
        return res.json({ msg: "User saved"});
    })
})

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