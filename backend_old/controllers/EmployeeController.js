const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let Employee = require('../models/employee.model');


//Create
router.post('/', function (req, res) {
    Employee.create({
        name: {
            first: req.body.name.first,
            last: req.body.name.last
        },
        email: req.body.email,
        passHash: req.body.passHash,
        isAdmin: req.body.isAdmin
    },
    function (err, employee) {
        if (err) return res.status(500).send("There was a problem adding the employee to the database.");
        res.status(200).send(employee);
    });
});

//Read
router.get('/', function (req, res) {
    Employee.find({}, function (err, employees) {
        if (err) return res.status(500).send("There was a problem finding the employees.");
        res.status(200).send(employees);
    });
});

router.get('/:id', function (req, res) {
    Employee.findById(req.params.id, function (err, employee) {
        if (err) return res.status(500).send("There was a problem finding the employee.");
        if (!employee) return res.status(404).send("Employee not found.");
        res.status(200).send(employee);
    });
});

//Update
router.put('/:id', function (req, res) {
    Employee.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, employee) {
        if (err) return res.status(500).send("There was a problem updating the employee.");
        res.status(200).send(employee);
    });
});

//Delete
router.delete('/:id', function (req, res) {
    Employee.findByIdAndDelete(req.params.id, function (err, employee) {
        if (err) return res.status(500).send("There was a problem deleting the employee.");
        res.status(200).send("Employee " + employee.name.first + " " + employee.name.last + " was deleted.");
    });
});


module.exports = router;
