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
		
		if (err) {
			res.render('request-all', { directories: err});
		}else if (directories==null) {
            res.render('request-all', { directories: 'empty'});
		}else {
			// render all the business listings from the database
			res.render('request-all', { directories: JSON.stringify(directories,undefined, 2)});
		}
	});
});



/**	
 *	requestType	:	/GET
 *	paramId		:	name
 *	routeName	:	/request-business/:name
 *	description	:	Find the requested business name and get business listing information
 */
app.get('/request-business/:name', function (req, res, next) {
    
	//get the business name from the request parameters and create the below query
	var query = { 'businessName' : req.params.name };

	//pass the query object to find the business listing in the database
    Directory.findOne(query, function (err, directory) {
        if (err) {
            res.render('request-business', { directory: err});
        }else if (directory==null) {
			res.render('request-business', { directory: 'empty', businessname: req.params.name});
		}else {
            res.render('request-business', { directory: JSON.stringify(directory,undefined,2)});
        }
    });
});

module.exports = app;
