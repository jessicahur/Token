'use strict';
//load libs
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Authenticat = require('authenticat');

const app = express();
const router = require('./lib/router');

var p1 = new Promise( (resolve, reject) => {
  const connection = mongoose.createConnection('mongodb://localhost/tokenAuth');
  const authenticat = new Authenticat(connection);

  app.use('/', authenticat.router); //general routing for signup, login and roles
  app.use('/employees', authenticat.tokenAuth, router);

  connection.on('error', err => {
    console.log(err);
    connection.close();
    reject(err);
  });
  connection.once('open', () => {
    console.log('User database connected');
    resolve();
  });
});

var p2 = new Promise( (resolve, reject) => {
  const connectionToEmployee = mongoose.createConnection('mongodb://localhost/test');

  connectionToEmployee.on('error', err => {
    console.log(err);
    connectionToEmployee.close();
    reject(err);
  });
  connectionToEmployee.on('open', () => {
    console.log('Employee database connected');
    resolve();
  });
});

Promise.all([p1,p2]).then( () => {
  app.listen(3000, console.log('Server has started. Listening at port 3000...'));
});

