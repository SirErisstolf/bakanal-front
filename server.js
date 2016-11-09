// grab the packages we need
var express = require('express');
var http = require('http');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080; //pasar este dato a archivo de configuracion y agregarlo a git ignore
//var port = process.env.PORT || 80;
var mongoose = require('mongoose');
var passport = require('passport');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var flash    = require('connect-flash');
var multer = require('multer');
var fs = require('fs');
var app = express();

app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
});

app.use(cookieParser()); 
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies


app.use(express.static('public'));
app.set('view engine', 'ejs'); 
require('./config/passport')(passport); 


mongoose.connect('mongodb://localhost/providers', function(err, res) {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log('Connected to Database');
  }
});

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); // use connect-flash for flash messages stored in session

require('./route/routes.js')(app,http,querystring,passport,multer,fs);
// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
