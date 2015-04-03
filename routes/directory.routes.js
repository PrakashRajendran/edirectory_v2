/**  
 *	@author	Prakash Rajendran 
 *	ver	1.0
 *	date : 03/04/2015
 *	file name : directory.routes.js
 *	Description: This is directory routing js file for routing all the GET/POST 
 *	requests from the client to server
 */

/*	Import the required node packages for routes	*/
var express = require('express'),
	app = express.Router();
	directoryModel = require('../models/directoryModel.js');
	formidable = require('formidable'), // used for parsing the incoming form
	http = require('http'), // for http requests
	fs   = require('fs-extra'), // for file upload process
    util = require('util'),	// for file manipulation
	mongoose = require('mongoose'),	// use mongoose to connect with MongoDB
	Directory = mongoose.model("Directory"); // Mongoose Directory Model

/**	
 *	requestType	:	/GET
 *	routeName	:	/browse-directory
 *	description	:	Get all the business directory listings from the database and display them in the browse-directory page
 */
app.get('/browse-directory', function(req, res) {
	Directory.find(function(err, directories) {

		// check if the directories from the database is empty or not
		if (isEmpty(directories)) {
			// render the browse-directory route page with no records
			res.render('browse-directory', { directories: { message : 'No records' } });
		}else {
			// render the browse directory route page with records
			res.render('browse-directory', { directories: directories });
		}
	});
});


/**	
 *	requestType	:	/GET
 *	routeName	:	/
 *	description	:	Load the home splash landing page
 */
app.get('/', function(req, res) {
	// render the browse-directory route page with no records
	res.render('index', { message : 'Home' });
});

/**	
 *	requestType	:	/GET
 *	routeName	:	/add-directory
 *	description	:	Render the add directory page to the client
 */
app.get('/add-directory', function(req, res) {
	// Display the Add directory page
	res.render('add-directory', { title: 'eDirectory | Add New Business'});
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
 *  routeName	:	/add-directory
 *	description	:	Post the submitted data from the add directory form and save the form details into the database
 */
app.post('/add-directory', function(req, res) {
	
	// Check if the request url is from /add-directory and request method is post
	if (req.url == '/add-directory' && req.method.toLowerCase() == 'post') {
		
		// define the formidable incoming form, businessLogourl
		var form = new formidable.IncomingForm(), directoryObj, businessLogoUrl;
		
		
		// parse the incoming form
		form.parse(req, function(err, fields, files) {
			
			// Set the business logo image to default image if the user hasn't uploaded any image for their business listing
			if (files.businesslogo.name!='') {
				businessLogoUrl = '/uploads/' + files.businesslogo.name;
			}else if (files.businesslogo.name=='') {
				businessLogoUrl = '/uploads/' + 'no_image.jpg';
			}
			// save the form details into the directoryObj JSON object
			directoryObj = {
				businessName : fields.businessname,
				businessDescription : fields.businessdescription,
				businessOwner : fields.businessownername,
				businessPhoneNo : fields.businessphoneno,
				businessWebsite : fields.businesswebsite,
				businessAddress : fields.businessaddress,
				businessEmail : fields.businessemail,
				businessLogoUrl : businessLogoUrl
			}
		});

		form.on('end', function(fields, files) {
			
			// Set the default image path if user hasn't uploaded any image
			
			/* Temporary location of our uploaded file */
			var temp_path = this.openedFiles[0].name==''?'public/images/no_image.jpg':this.openedFiles[0].path;
			/* The file name of the uploaded file */
			var file_name = this.openedFiles[0].name==''?'no_image.jpg': this.openedFiles[0].name;
			/* Location where we want to copy the uploaded file */
			var new_location = 'public/uploads/';
			
			// copy the file from temporary path to the public/uploads directory
			fs.copy(temp_path, new_location + file_name, function(err) {  
				if (err) {
					res.render('error', { error: err});
					res.end();
				} else {
					// Use the Directory Model and save the form data into the database
					Directory.create(directoryObj, function(err, objects, callback) {

						if (err) {
							res.render('error', { error: err});
							res.end();
						} else {   
							res.render('success', { message: 'Create'});
							res.end();
						}
					});
				}
			});
		});
	}
});

/**	
 *	requestType	:	/POST
 *	routeName	:	/edit-directory/:id
 *	paramId		: 	id
 *	description	:	Get all the business directory listings and display them in the index page
 */
app.post('/edit-directory/:id', function(req, res) {
	
		var id = req.params.id;
		
		// Post the form data from add-directory page
		var form = new formidable.IncomingForm(), directoryObj, businessLogoUrl;
		
		form.parse(req, function(err, fields, files) {
			
			if (files.businesslogo.name!='') {
				businessLogoUrl = '/uploads/' + files.businesslogo.name;
			}else if (files.businesslogo.name=='') {
				console.log("no image");
				businessLogoUrl = '/uploads/' + 'no_image.jpg';
			}
			directoryUpdateObj = {
				_id: req.params.id,
				businessName : fields.businessname,
				businessDescription : fields.businessdescription,
				businessOwner : fields.businessownername,
				businessPhoneNo : fields.businessphoneno,
				businessWebsite : fields.businesswebsite,
				businessAddress : fields.businessaddress,
				businessEmail : fields.businessemail,
				businessLogoUrl : businessLogoUrl
			}
		});

		form.on('end', function(fields, files) {
			/* Temporary location of our uploaded file */
			console.log("opened file   " + this.openedFiles[0].name);
			var temp_path = this.openedFiles[0].name==''?'public/images/no_image.jpg':this.openedFiles[0].path;
			console.log("temp path   " +temp_path);
			/* The file name of the uploaded file */
			var file_name = this.openedFiles[0].name==''?'no_image.jpg': this.openedFiles[0].name;
			
			console.log("file name " +file_name);
			/* Location where we want to copy the uploaded file */
			var new_location = 'public/uploads/';
			fs.copy(temp_path, new_location + file_name, function(err) {  
				if (err) {
					res.render('error', { error: err});
					res.end();
				} else {
					Directory.update({ _id: id}, directoryUpdateObj, function(err) {
						console.log("inside directory.update method");

						if (err) {
							res.render('error', { error: err});
							res.end();
						} else {  //update
							console.log("inside directory.update insert method");
							res.render('success', { message: 'Update'});
							res.end();
						}
					});
				}
			});
		});
});

/**	
 *	requestType	:	/GET
 *	paramId		:	id
 *	routeName	:	/edit-directory/:id
 *	description	:	Get all the business directory listings and display them in the index page
 */
app.get('/edit-directory/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the product model to look up the product with this id    
    Directory.findById(id, function (err, directory) {
        if (err) {
            res.send('Directory Listing ' + id + ' not found');
        }
        else {
            res.render('edit-directory', { directory: directory });
        }
    });
});

/**	
 *	requestType	:	/GET
 *	paramId		:	id
 *	routeName	:	/delete-directory/:id
 *	description	:	Get all the business directory listings and display them in the index page
 */
app.get('/delete-directory/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the directory model to look up the business listing with this id    
    Directory.findByIdAndRemove(id, function (err, directory) {
        if (err) {
            res.send('Error finding business directory listing ==>' + id);
        }
        else {
            res.render('success', { message: 'Delete'} );
			res.end();
        }
    });
});

module.exports = app;
