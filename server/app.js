var express = require("express");
var path = require("path");
var http = require("http");
const userRoutes = require("./routes/user.route")
const studentsRoutes = require("./routes/students.route")
const instrumentsRoutes = require("./routes/instruments.route")
const loansRoutes = require("./routes/loans.route")
const adminRoutes = require("./routes/admin.route")
var bodyParser = require('body-parser')


var app = express();
app.use(express.static(path.join(__dirname, '../dist/base-project')))
var cors = require('cors')
var bodyParser = require('body-parser')



var app = express();

app.use(cors())// for development porposes
app.use(bodyParser.json()); //to parse post requests

app.use(express.static(__dirname + '/../dist/base-project'))
const port = 8080

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


item1 = {'item':'Don’t Make Me Think by Steve Krug','availability':1, 'qty':1,'price':30.02}
item2 = {'item':'A Project Guide to UX Design by Russ Unger & Carolyn Chandler','availability':1, 'qty':2,'price':52.94}
item3 = {'item':'Introducing HTML5 by Bruce Lawson & Remy Sharp	','availability':0, 'qty':1,'price':22.23}
item4 = {'item':'Bulletproof Web Design by Dan Cederholm	','availability':1, 'qty':1,'price':30.17}
item5 = {'item':'my fifth-last item','availability':0, 'qty':7,'price':17.2}
item6 = {'item':'my fifth-last item','availability':0, 'qty':1000,'price':17.2}
item7 = {'item':'my fifth-last item','availability':0, 'qty':7,'price':17.2}
item8 = {'item':'my fifth-last item','availability':0, 'qty':7,'price':17.2}
item9 = {'item':'my fifth-last item','availability':15, 'qty':7,'price':17.2}


app.use('/*',(req,res)=>
    res.sendFile(path.join(__dirname))
    );


    app.post('/api/login',(req,res)=>{
        console.log(req.body)
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");

        res.setHeader("Access-Control-Allow-Methods",
            "POST");

        user = {'id':7,firstName:'Baraa',lastName:'Natour',username:'bnatour'}
        res.json(user)
    })

    app.post('/api/logout',(req,res)=>{
        console.log(req.body)
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");

        res.setHeader("Access-Control-Allow-Methods",
            "POST");

        user = {}
        res.json(user)
    })


app.get('/api/example-table',(req,res)=>{
    console.log('aaa');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS");
    data = [item1,item2,item3,item4,item5,item6,item7,item8,item9]
    res.json(data)
})





app.use("/api/user", userRoutes)
app.use("/api/user/students", studentsRoutes)
app.use("/api/user/instruments", instrumentsRoutes)
app.use("/api/user/loans", loansRoutes)
app.use("/api/user/manage", adminRoutes)


const server = http.createServer(app)
server.listen(port,()=>{
    console.log("Server Is Up On Port: " + port)
})


module.exports = app;
