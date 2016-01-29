'use strict';
//load libs
const express = require('express');
const mongoose = require('mongoose');
const Authenticat = require('authenticat');

const app = express();
const router = require('./lib/router');

const connection = mongoose.createConnection('mongodb://localhost/tokenAuth');
const authenticat = new Authenticat(connection);

app.use('/employees', authenticat.tokenAuth, router);
app.use('/', authenticat.router); //general routing for signup, login and roles

//404
app.use((req, res, next) => {
  res.sendStatus(404);
});

connection.on('error', err => {
    console.log(err);
    connection.close();
  });
connection.once('open', () => {
  app.listen(3000, console.log('Server has started. Listening at port 3000...'));
});

module.exports = app;
