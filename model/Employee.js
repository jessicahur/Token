const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeConnection = mongoose.createConnection('mongodb://localhost/test');
const Employee = new Schema({ //Future updates cannot alter id and username
  _id: {
    type: String,
    require: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    require: true,
    unique: true,
    index: true
  },
  DOB: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true,
    validate: {
      validator: function(value) {
        return /[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(value);
      },
      message: '{VALUE} is not a valid phone number!'
    }
  },
  email: {
    type: String,
    require: true,
    match: /.+\@.+\..+/
  },
  position: {
    type: String,
    require: true,
    enum: ['manager', 'accountant', 'engineer', 'receptionist']
  }
});

module.exports = employeeConnection.model('Employee', Employee); //Bind this specific database connection to the Schema
