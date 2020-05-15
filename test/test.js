var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var request  = require("supertest");
agent = request.agent(app)
var expect = chai.expect;
let should = chai.should();
const UserRepo       = require('../Data/UserRepo');
const _userRepo      = new UserRepo();
const EventRepo      = require('../Data/EventRepo');
const _EventRepo     = new EventRepo();

chai.use(chaiHttp);

describe('Properly create, login, and delete user', () => {
  it('it should register properly', (done) => {
      let user = 
      {
        firstName: "james",
        lastName: "Paul",
        email: "jpr@gmail.com",
        username: "james223",
        password: "123456",
        passwordConfirm: "123456"
    }
    chai.request(app)
        .post('/user/registeruser')
        .send(user)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
          done();
        })
  });

  it('it should login properly', (done) => {
    let login = 
    {
      username: "james223",
      password: "123456",
  }
  chai.request(app)
      .post('/auth')
      .send(login)
      .end((err, res) => {
            deleter("james223");
            res.should.have.status(200);
            res.body.should.be.a('object');
        done();
      })
  });

  it('it should update user properly', (done) => {
    let user = 
    {
      firstName: "Bill",
      lastName: "Smith",
      email: "jpr@gmail.com",
      username: "james223",
      old_username: "james223",
  }
  chai.request(app)
      .post('/user/UpdateUser')
      .send(user)
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
        done();
      })
});

  async function deleter(username)
  {
    let deletedItem  = await _userRepo.delete(username);
  }

});

/*Event Testing */

describe('Properly create and delete event', () => {
  it('it should Create Event properly', (done) => {
      let event = 
      {
        name:           "Study for Node",
        description:    "Difficult Test",    
        people:         "Paul",        
        date:           "2018-06-12T19:30",
        userID:         "5eb2ee871ee4361d6800dedd"           
      }
    chai.request(app)
        .post('/user/CreationEvent')
        .send(event)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
          done();
        })
  });

  it('it should delete properly', (done) => {
    let delete_val = 
    {
      _id: "5eb2ee871ee4361d6800dedd",
    }
  chai.request(app)
      .post('/event/altDelete')
      .send(delete_val)
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
        done();
      })
  });
});




describe('Create bad event', () => {
  it('it should NOT Create Event properly', (done) => {
      let event = 
      {
        name:           "",
        description:    "Difficult Test",    
        people:         "Paul",        
        date:           "2018-06-12T19:30",
        userID:         "5eb2ee871ee4361d6800dedd"           
      }
    chai.request(app)
        .post('/user/CreationEvent')
        .send(event)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
          done();
        })
  });
});

describe('Fails to login', () => {
  it('it should not login properly', (done) => {
    let login = 
    {
      username: "opss",
      password: "123456",
  }
  chai.request(app)
      .post('/auth')
      .send(login)
      .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
        done();
      })
  });
});
