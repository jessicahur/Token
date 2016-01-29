'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const btoa = require('btoa');
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

  var token = '';

  //signup for a test account. Even if it existed, err is not returned (get status 500 in res.status)
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
          expect(err).to.be.null;
          assert.equal(res.statusCode, 401);
          done();
        });
  });

  it('should successfully sign in and receive a token', done => {
    var header = btoa('testing'+':'+'test');
    chai.request(app)
        .get('/signin')
        .set('authorization', 'Basic '+header) //'Basic dGVzdGluZzp0ZXN0'
        .end((err, res) => {
          token = res.body.token;
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.redirects.length).to.equal(0);
          done();
        });
  });

  it('should successfully access "/employees" with the given token', done => {
    chai.request(app)
        .get('/employees')
        .set('token', token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.redirects.length).to.equal(0);
          done();
        });
  });

});
