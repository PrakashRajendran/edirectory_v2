/* 
	@author	Prakash Rajendran 
	ver	1.0
	date : 03/04/2015
	file name : app.js
	Description: Core module config to serve the application
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require ("mongoose"); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads')));


var directory = require('./routes/directory.routes');
var api = require('./routes/api.routes');

app.use('/', directory);
app.use('/api', api);
app.use('/directory', directory);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Here we find an mongolab cloud hosting database to connect to
var mongodbString = 'mongodb://admin:edirectory@ds059821.mongolab.com:59821/edirectory';

// Mongoose will queue up database operations and release them when the connection is complete. Makes connection asynchronously.
mongoose.connect(mongodbString, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to mongodb: ' + mongodbString + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + mongodbString);
  }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
	var redirectError;
    if (err.status || 404) {
		res.status = 404;
		redirectError = '404';
	}else if(req.report.status || 500) {
		redirectError = 'error';
	}
	res.render(redirectError, {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 404);
  res.render('404', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
