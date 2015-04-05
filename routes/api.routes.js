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
 *	routeName	:	/browse-directory
 *	description	:	Get all the business directory listings from the database and display them in the browse-directory page
 */
app.get('/request-all', function(req, res) {
	Directory.find(function(err, directories) {
		// render the browse-directory route page with no records
		res.render('request-all', { directories: JSON.stringify(directories,undefined, 2)});
	});
});

/**	
 *	requestType	:	/GET
 *	paramId		:	id
 *	routeName	:	/request-business/:name
 *	description	:	Find the requested business name and get business listing information
 */
app.get('/request-business/:name', function (req, res, next) {
    //store the id from the url in a variable
    
	var query = { 'businessName' : req.params.name };

    Directory.findOne(query, function (err, directory) {
        if (err) {
			console.log(err);
            res.render('error', { error: 'Error finding business listing ' + id, errorStack: err.stack} );	
        }
        else {
			console.log(directory);
            res.render('request-business', { directory: directory});
        }
    });
});

module.exports = app;
