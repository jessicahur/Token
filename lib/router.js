'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const Employee = require('../model/Employee');

var router = express.Router();

router.use(bodyParser.json());

//POST
router.post('/', (req, res, next) => {
  var postedEmployee = req.body;

  if (!Object.keys(postedEmployee).length) return res.sendStatus(400);

  var newEmployee = new Employee({
    _id: postedEmployee._id,
    name: postedEmployee.name,
    username: postedEmployee.username,
    DOB: new Date(postedEmployee.DOB),
    email: postedEmployee.email,
    address: postedEmployee.address,
    phone: postedEmployee.phone,
    position: postedEmployee.position
  });

  newEmployee.save((err, savedEmployee) => {
    if (err) {
      console.error(err);
      return res.sendStatus(400);
    }
    res.json(savedEmployee);
  });

});

//General GET
router.get('/', (req, res, next) => {
  Employee.find({}).lean().exec( (err, employees) => {
    if (err) {
      console.error(err);
      res.end();
    }
    res.json(employees);
  });

});


//Specific get
router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Employee.findById(id, (err, employee) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(employee);
  });
});

//DELETE
router.delete('/:id', (req, res, next) => {
  Employee.where().findOneAndRemove({'_id': req.params.id}, {}, (err, removedEmployee) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(removedEmployee);
  });
});

//PUT & PATCH
router.all('/:id', (req, res, next) => {
  var id = req.params.id;
  var update = req.body;
  update.DOB = new Date(update.DOB);

  Employee.findByIdAndUpdate(id, update, {runValidators: true, multi: false}, (err, numAffected) => {
    if (err) {
      res.sendStatus(400);
      return console.error(err);
    }

    Employee.findById(req.params.id, (err, employee) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json(employee);
    });

  });
});

module.exports = router;
