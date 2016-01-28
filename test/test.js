'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;

const app = require('../app');
const Employee = require('../model/Employee');

const mongoose = require('mongoose');
const Authenticat = require('authenticat');

const connection = mongoose.createConnection('mongodb://localhost/tokenAuth');
const authenticat = new Authenticat(connection);

chai.use(chaiHttp);

describe('Token Authentication', () => {
  before( done => {
    connection.on('error', err => {
      connection.close();
      done(err);
    });
    connection.once('open', () => {
      chai.request(app)
          .post('/signup')
          .send({'username': 'testing', 'password': 'test'})
          .end((err, res) => {
            if (err) return done(err);
            done();
          });

    });
  });

  it('should receive status 401 for unauthenticated access', done => {
    chai.request(app)
        .get('/employees')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
  });

});
