process.env.NODE_ENV = 'test';
var server = require('../server/app');
var chai = require('chai');
var Fix = require('../server/models/fixes.model');
var User = require('../server/models/user.model');
var Maintainer = require('../server/models/maintainer.model');
var Instrument = require('../server/models/instrument.model');
var History = require('../server/models/history.model');
var chaiHttp = require('chai-http');
var assert = require('assert');
chai.use(chaiHttp);

describe('Fixes Tests', function() {

  let ids =[];
  let fixid ='';
    after(function(done) {
        Instrument.collection.drop();
        History.collection.drop();
        User.collection.drop();
        Maintainer.collection.drop();
        Fix.collection.drop();
        done();
    });



    before(function(done){
      ids = addData();
      done();
    })

    let addData = function(){
      const maintainer = new Maintainer({
        maintainerName: 'mahmoud',
        maintainerPhone: '052342423',
        maintainerAddress: 'school a',
      });
      maintainer.save();
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
      const user = new User({
        name: "user1",
        username: "user1",
        password: "123",
        privilege: "admin"
      });
      user.save();
      return [maintainer._id,instrument._id,user._id];
    }

    it('Should send Instrument to maintaince', function(done) {
      console.log(ids);
        chai.request(server)
        .post('/api/user/fixes/fix')
        .send({
            "maintainer": ids[0],
            "instrument": ids[1],
            "user": ids[2],
            "notes":"haha"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('message').eql("success");
            let id = res.body.data;
            fixid=id;
            chai.request(server)
            .get('/api/user/instruments/'+ids[1])
            .send({})
            .end(function(err, res){
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('data');
              res.body.data.should.have.property('history');
              res.body.data.should.have.property('instrument');
              res.body.data.instrument.should.have.property('status').eql('inFix')
            });
            done();
        });
    });


  it('Should get intrument fixed', function(done) {
    console.log(ids);
      chai.request(server)
      .post('/api/user/fixes/endFix/'+fixid)
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

  it('Should filter fix of an Instrument', function(done) {
      chai.request(server)
      .get('/api/user/fixes/filter/done_instrumentType_instrumentSubtype')
      .set('user_id',ids[2])
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message').eql("success");
          let data = res.body.data;
          for(let i=0 ;i<data.length;i++){
            assert(data[i].status == 'done')
          }
          done();
      });
  });


});
