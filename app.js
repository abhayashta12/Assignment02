//installed 3rd party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// Step -1 import db package
let mongoose = require ('mongoose');

//import the router data
let indexRouter = require('./Server/routes/index');
let usersRouter = require('./Server/routes/users');

let app = express();

// Step 2 Complete the DB configuration
let DBConfig = require('./Server/Config/db'); //might give error 
mongoose.connect(DBConfig.LocalURI);
var db = mongoose.connection; //alias for the mongoose connection

// Step 3- Listen for Connections or Errors

db.on("open", function()
{
  console.log('Connected to MongoDB at: ${DBConfig.HostName}');
});

db.on("error", function()
  {
    console.error('Connection Error');
  }
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //express -e

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Clients')));
app.use(express.static(path.join(__dirname, 'node_modules')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Error'});
});

module.exports = app;
