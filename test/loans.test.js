process.env.NODE_ENV = 'test';
var server = require('../server/app');
var chai = require('chai');
var Loan = require('../server/models/loan.model');
var User = require('../server/models/user.model');
var Student = require('../server/models/student.model');
var Instrument = require('../server/models/instrument.model');
var History = require('../server/models/history.model');
var chaiHttp = require('chai-http');
var assert = require('assert');
chai.use(chaiHttp);

describe('Loans Tests', function() {

  let ids =[];
  let loanid ='';
    after(function(done) {
        Loan.collection.drop();
        Student.collection.drop();
        Instrument.collection.drop();
        History.collection.drop();
        User.collection.drop();
        done();
    });



    before(function(done){
      ids = addData();
      done();
    })

    let addData = function(){
      const student = new Student({
        fName: 'mahmoud',
        lName: 'saleh',
        school: 'school a',
        level: 'legendary',
        class: 'class of legends',
        parent1Name: 'father',
        parent2Name: 'mother',
        parent1PhoneNumber: '0501233211',
        parent2PhoneNumber: '0524322342',
        parent1Email: 'a@b.c',
        parent2Email: 'c@b.a',
      });
      student.save();
      const instrument = new Instrument({
        generalSerialNumber: '9991',
        type: 'type1',
        sub_type: 'subtype1',
        company: 'company1',
        style: 'style1',
        imprentedSerialNumber: '99911',
        ownership: 'owner1',
        status: 'available'
      });
      instrument.save();
      const user = new User({
        name: "user",
        username: "user",
        password: "123",
        privilege: "admin"
      });
      user.save();
      return [student._id,instrument._id,user._id];
    }


    it('Should get loans', function(done) {
      console.log(ids);
      chai.request(server)
      .get('/api/user/loans')
      .end(function(err, res) {
          res.should.have.status(200);
          done();
      });
  });


    it('Should loan Instrument', function(done) {
        console.log(ids);
        chai.request(server)
        .post('/api/user/loans/loanInstrument')
        .send({
            "student": ids[0],
            "instrument": ids[1],
            "user": ids[2],
            "notes":"haha"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('message').eql("success");
            let id = res.body.data;
            loanid=id;
            chai.request(server)
            .get('/api/user/instruments/'+ids[1])
            .send({})
            .end(function(err, res){
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('data');
              res.body.data.should.have.property('history');
              res.body.data.should.have.property('instrument');
              res.body.data.instrument.should.have.property('status').eql('loaned')

            });
            done();
        });
    });

    it('Should not loan Instrument because the instrument is already loaned', function(done) {
      chai.request(server)
      .post('/api/user/loans/loanInstrument')
      .send({
          "student": ids[0],
          "instrument": ids[1],
          "user": ids[2],
          "notes":"haha"
      })
      .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message').eql("failed: the instrument is not available");
          done();
      });
  });

  it('Should end loan of an Instrument', function(done) {
    console.log(ids);
      chai.request(server)
      .post('/api/user/loans/endLoan/'+loanid)
      .set('user_id',ids[2])
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message').eql("success");
          let id = res.body.data;
          chai.request(server)
          .get('/api/user/instruments/'+ids[1])
          .send({})
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('data');
            res.body.data.should.have.property('history');
            res.body.data.should.have.property('instrument');
            res.body.data.instrument.should.have.property('status').eql('available')

          });
          done();
      });
  });

  it('Should filter loana of an Instrument', function(done) {
      chai.request(server)
      .get('/api/user/loans/filter/studentLevel_studentClass_closed_instrumentType_instrumentSubtype')
      .set('user_id',ids[2])
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message').eql("success");
          let data = res.body.data;
          for(let i=0 ;i<data.length;i++){
            assert(data[i].status == 'closed')
          }
          done();
      });
  });


});
