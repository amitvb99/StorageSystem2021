process.env.NODE_ENV = 'test';
var server = require('../server/app');
var chai = require('chai');
var Student = require('../server/models/student.model');
var Instrument = require('../server/models/instrument.model');
var Notifications = require('../server/models/notifications.model');
var chaiHttp = require('chai-http');
var assert = require('assert');

const { request } = require('../server/app');


chai.use(chaiHttp);

describe('Notifications Tests', function() {

    let ids =[];
    after(function (done) {
        Student.collection.drop();
        Instrument.collection.drop();
        Notifications.collection.drop();
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
        generalSerialNumber: '99912',
        type: 'type1',
        sub_type: 'subtype1',
        company: 'company1',
        style: 'style1',
        imprentedSerialNumber: '999113',
        ownership: 'owner1',
        status: 'available'
      });
      instrument.save();

      return [student._id,instrument._id];
    }

    it('Should get instrumnets', function(done) {
      console.log(ids);
      chai.request(server)

      .get('/api/user/instruments')
      .set("access", "yes")
      .end(function(err, res) {
          res.should.have.status(200);
          done();
      });
  });

    it('Sould add notification to the stack', function(done) {
        console.log(ids);
        chai.request(server)

        .put('/api/user/instruments/'+ids[1])
        .set("access", "yes")
        .send({
          "generalSerialNumber": '99912',
          'type': 'type1',
          'sub_type': 'subtype1',
          'company': 'company1',
          'style': 'style1',
          'imprentedSerialNumber': '99911',
          'ownership': 'owner1',
          'status': 'stolen'
        })
        .end(function(err,res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('message').eql("success");
            var id = res.body.data;
            chai.request(server)

            .get('/api/user/notifications')
            .set("access", "yes")
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                console.log(res.body.data);
                assert(res.body.data.length==0)
            });
            done();
        });
    });

});

