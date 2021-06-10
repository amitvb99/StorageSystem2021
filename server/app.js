var express = require("express");
var path = require("path");
var http = require("http");
global.__basedir = __dirname;
const userRoutes = require("./routes/user.route")
const studentsRoutes = require("./routes/students.route")
const maintainersRoutes = require("./routes/maintainers.route")
const instrumentsRoutes = require("./routes/instruments.route")
const loansRoutes = require("./routes/loans.route")
const adminRoutes = require("./routes/admin.route")
const notificationRoutes = require("./routes/notificatoins.route")
const importsRoutes = require("./routes/imports.route")
const fixesRoutes = require("./routes/fixes.route")
const User = require("./models/user.model")
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
const multer= require("multer")


var app = express();
app.use(express.static(path.join(__dirname, '../dist/base-project')))
var cors = require('cors')

//mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/database?retryWrites=true&w=majority

// mongoose.connect("mongodb://localhost:27017/myapp")
// mongoose.connect("mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/test_database?retryWrites=true&w=majority")
test_mode = false;
local_host = false;
for (let i in process.argv) {

  if (process.argv[i] == '-test_mode') {
    test_mode = true
}

if (process.argv[i] == '-local') {
  local_host = true
}

}
let url="";
if (test_mode) {
    url="mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/test_database?retryWrites=true&w=majority";
    console.log('We Are In Test Mode.')
} else if (local_host) {
    url="mongodb://localhost:27017/myapp";
    console.log('We Are In Mahmoud Mode.[جنن ابوي]')
} else {
    url="mongodb+srv://mahmoud:egqL9abn@cluster0.uw98a.mongodb.net/database?retryWrites=true&w=majority";
    console.log('We Are In Production Mode.')
}

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/myapptest", { useUnifiedTopology: true, useNewUrlParser: true })

  .then(()=>{
    console.log('Connected to database!')
  }).catch(()=>{
    console.log('Connection failed!')
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


app.post('/api/db/clear',(req,res)=>{
  if(!test_mode)
    return res.status(403).json({
      message: "failed",
    });
  mongoose.connection.db.dropDatabase();
  mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(()=>{
    console.log('Connected to database again!')
    res.status(201).json({
      message: "success"
    });
  }).catch(()=>{
    console.log('Connectino failed!')
    return res.status(500).json({
      message: "failed",
    });
  });
  const user = new User({name: "admin", username: "admin", password: "admin"});
  user.save();
  return res;
});



app.use("/api/user", userRoutes)
app.use("/api/user/students", studentsRoutes)
app.use("/api/user/maintainers", maintainersRoutes)

app.use("/api/user/instruments", instrumentsRoutes)
app.use("/api/user/loans", loansRoutes)
app.use("/api/user/manage", adminRoutes)
app.use("/api/user/notifications", notificationRoutes)
app.use("/api/user/imports", importsRoutes)
app.use("/api/user/fixes", fixesRoutes)



const server = http.createServer(app)
server.listen(port,()=>{
    console.log("Server Is Up On Port: " + port)
})


module.exports = app;
