/**  
 *	@author	Prakash Rajendran 
 *	ver	1.0
 *	date : 03/04/2015
 *	file name : api.routes.js
 *	Description: This api provides methods for external applications to retreive the business directory listings
 *	requests from the client to server
 */

/*	Import the required node packages for routes	*/
var express = require('express'),
	app = express.Router();
	formidable = require('formidable'), // used for parsing the incoming form
	http = require('http'), // for http requests
	mongoose = require('mongoose'),	// use mongoose to connect with MongoDB
	Directory = mongoose.model("Directory"); // Mongoose Directory Model

/**	
 *	requestType	:	/GET
 *	routeName	:	/request-all
 *	Usage		: 	API
 *	description	:	Get all the business directory listings from the database and return the JSON object
 */
app.get('/request-all', function(req, res) {
	Directory.find(function(err, directories) {
		
		if (err) {
			var report = new Error('Error finding the business listings' + id);
			report.status = 500;
            report.inner = err;
			return next(report);
		}else if (isEmpty(directories)) {
			res.render('request-all', { directories: 'empty'});
		}else {
			// render the request-all page with JSON object
			res.render('request-all', { directories: JSON.stringify(directories,undefined, 2)});
		}
		
	});
});

/**
 *	functionName	: isEmpty
 *	description		: It is used to check the object is empty or not
 */
var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

/**	
 *	requestType	:	/GET
 *	paramId		:	id
 *	Usage		:	API
 *	routeName	:	/request-business/:name
 *	description	:	Find the requested business name and return the JSON object
 */
app.get('/request-business/:name', function (req, res, next) {
    
	//get the value from the request parameter
    var query = { 'businessName' : req.params.name };

	// Use the mongoose directory model to find the requested business name in the mongo database and return the JSON object
    Directory.findOne(query, function (err, directory) {
        if (err) {
			var report = new Error('Error finding business listing ' + id);
			report.status = 500;
            report.inner = err;
			return next(report);
        }else if (directory==null) {
			res.render('request-business', { directories: 'empty'});
		}
        else {
            res.render('request-business', { directory: directory});
        }
    });
});

//export the app so that the entire application can use it

module.exports = app;
