var express = require("express");
var path = require("path");
var http = require("http");
const userRoutes = require("./routes/user.route")
const studentsRoutes = require("./routes/students.route")
const instrumentsRoutes = require("./routes/instruments.route")
const loansRoutes = require("./routes/loans.route")
const adminRoutes = require("./routes/admin.route")
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
const multer= require("multer")


var app = express();
app.use(express.static(path.join(__dirname, '../dist/base-project')))
var cors = require('cors')

//mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/database?retryWrites=true&w=majority

// mongoose.connect("mongodb://localhost:27017/myapp")
mongoose.connect("mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/test_database?retryWrites=true&w=majority")
test_mode = false
for (let i in process.argv) {
    if (process.argv[i] == '-test_mode') {
        test_mode = true
    }
}

if (test_mode) {
    /*
    make sure to connect to test db.
    */
    console.log('We Are In Test Mode.')
} else {
    /*
    connect to normal db
    */
    console.log('We Are In Production Mode.')
}

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/database?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
  .then(()=>{
    console.log('Connected to database!')
  }).catch(()=>{
    console.log('Connectino failed!')
  });

var app = express();

app.use(cors())// for development porposes
app.use(bodyParser.json()); //to parse post requests

app.use(express.static(__dirname + '/../dist/base-project'))
const port = 8080

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/*',(req,res)=>
    res.sendFile(path.join(__dirname))
    );


    // app.post('/api/login',(req,res)=>{
    //     console.log(req.body)
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader(
    //         "Access-Control-Allow-Headers",
    //         "Origin, X-Requested-With, Content-Type, Accept");

    //     res.setHeader("Access-Control-Allow-Methods",
    //         "POST");

    //     user = {'id':7,firstName:'Baraa',lastName:'Natour',username:'bnatour'}
    //     res.json(user)
    // })

    // app.post('/api/logout',(req,res)=>{
    //     console.log(req.body)
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader(
    //         "Access-Control-Allow-Headers",
    //         "Origin, X-Requested-With, Content-Type, Accept");

    //     res.setHeader("Access-Control-Allow-Methods",
    //         "POST");

    //     user = {}
    //     res.json(user)
    // })


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/user", userRoutes)
app.use("/api/user/students", studentsRoutes)
app.use("/api/user/instruments", instrumentsRoutes)
app.use("/api/user/loans", loansRoutes)
app.use("/api/user/manage", adminRoutes)
if (test_mode) {
  app.use("/api/db/clear", adminRoutes)
}

const server = http.createServer(app)
server.listen(port,()=>{
    console.log("Server Is Up On Port: " + port)
})


module.exports = app;
