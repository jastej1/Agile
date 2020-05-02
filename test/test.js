var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var request  = require("supertest");
agent = request.agent(app)
var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('RegisterUser', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .post('/User/RegisterUser')
        .send({'firstName': 'P', 'lastName': 'T','email':'A', 'username':'s'})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('Login', function() {
  it('responds with status 200', function(done) {
    chai.request(app)
      .post('/auth')
      .field('username', 'j')
      .field('password', '1')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});
