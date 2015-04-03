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
	http = require('http'), // for http requests
	mongoose = require('mongoose'),	// use mongoose to connect with MongoDB
	Directory = mongoose.model("Directory"); // Mongoose Directory Model

/**	
 *	requestType	:	/GET
 *	routeName	:	/request-all
 *	description	:	Get all the business directory listings from the database and display them in the browse-directory page
 */
app.get('/request-all', function(req, res) {
	Directory.find(function(err, directories) {
		
		if (isEmpty(directories)) {
            res.render('request-all', { directories: 'Oops...We couldn\'t able to find the requested business name ' + req.params.name + ' in our database '});
		}else {
			// render all the business listings from the database
			res.render('request-all', { directories: JSON.stringify(directories,undefined, 2)});
		}
	});
});

/**
 *	functionName	: isEmpty
 *	description		: It is used to check the object empty or not
 */
var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

/**	
 *	requestType	:	/GET
 *	paramId		:	name
 *	routeName	:	/request-business/:name
 *	description	:	Find the requested business name and get business listing information
 */
app.get('/request-business/:name', function (req, res, next) {
    
	//get the business name from the reqest parameters and create the below query
	var query = { 'businessName' : req.params.name };

	//pass the query object to find the business listing in the databbase
    Directory.findOne(query, function (err, directory) {
        if (err) {
            res.render('request-business', { directory: 'Oops...We couldn\'t able to find the requested business name ' + req.params.name + ' in our database '});
        }
        else {
            res.render('request-business', { directory: directory});
        }
    });
});

module.exports = app;
