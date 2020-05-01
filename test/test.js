var User, app, mongoose, request, server, should, user, agent;

should   = require("should");
mongoose = require("mongoose");
request  = require("supertest");
agent = request.agent('http://localhost:1337')

  describe('Login test', function () {
      it('should redirect to /', function (done) {
        agent
        .post('/User/LoginUser')
        .field('username', 'x')
        .field('password', 'x')
        .expect('Location','/User/Login?errorMessage=Invalid%20login.')
        .end(done)
      })
})
