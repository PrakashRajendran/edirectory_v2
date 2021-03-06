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
			res.render('browse-directory', { directories: { message : 'No records', title: 'eDirectory | Browse All Business' } });
		}else {
			// render the browse directory route page with records
			res.render('browse-directory', { directories: directories, title: 'eDirectory | Browse All Business' });
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
	res.render('index', { title : 'eDirectory | Home' });
});

/**	
 *	requestType	:	/GET
 *	routeName	:	/add-directory
 *	description	:	Render the add directory page to the client
 */
app.get('/add-directory', function(req, res) {
	// Display the Add directory page
	res.render('add-directory', { title: 'eDirectory | Register New Business'});
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
 *  routeName	:	/add-directory
 *	description	:	Post the submitted data from the add directory form and save the form details into the database
 */
app.post('/add-directory', function(req, res) {
	
	// Check if the request url is from /add-directory and request method is post
	if (req.url == '/add-directory' && req.method.toLowerCase() == 'post') {
		
		// define the formidable incoming form, businessLogourl, directoryObj
		var form = new formidable.IncomingForm(), directoryObj, businessLogoUrl;
		
		
		// parse the incoming form
		form.parse(req, function(err, fields, files) {
			
			// Set the business logo image to default image if the user hasn't uploaded any image for their business listing
			if (files.businesslogo.name!='') {
				businessLogoUrl = '/uploads/' + files.businesslogo.name;
			}else if (files.businesslogo.name=='') {
				businessLogoUrl = '/uploads/' + 'no_image.jpg';
			}
			// create the JSON object and store the form details
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
					var report = new Error('Error occured during the file upload process'); // render error if any error occured during file upload process
					report.status = 500;
					report.inner = err;
					return next(report);  
				} else {
					// Use the Directory Model and save the form data into the database
					Directory.create(directoryObj, function(err, objects, callback) {
						if (err) {
							res.render('error', { error: 'Error creating business listing ' + id, errorStack: err.stack} );	
						} else {   
							res.render('success', { message: 'Create', title: 'eDirectory | Added Business'}); // redirect the user to success page with the success message
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
	
		//get the value from the request parameter
		var id = req.params.id;
		
		// define the formiable form, directoryObj, businessLogoUrl
		var form = new formidable.IncomingForm(), directoryObj, businessLogoUrl;
		
		// start the form parsing
		form.parse(req, function(err, fields, files) {
			
			// set the default if the user hasn't uploaded any image
			if (files.businesslogo.name!='') {
				businessLogoUrl = '/uploads/' + files.businesslogo.name;
			}else if (files.businesslogo.name=='') {
				console.log("no image");
				businessLogoUrl = '/uploads/' + 'no_image.jpg';
			}
			// create the JSON object and store the form details
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

		// start saving the form once the file upload is complete
		form.on('end', function(fields, files) {
			
			/* Temporary location of our uploaded file */
			var temp_path = this.openedFiles[0].name==''?'public/images/no_image.jpg':this.openedFiles[0].path;

			/* The file name of the uploaded file */
			var file_name = this.openedFiles[0].name==''?'no_image.jpg': this.openedFiles[0].name;
			
			/* Location where we want to copy the uploaded file */
			var new_location = 'public/uploads/';
			fs.copy(temp_path, new_location + file_name, function(err) {  
				if (err) {
					res.render('error', { error: err}); // render the error message if any issues occured during the file upload process
				} else {
					Directory.update({ _id: id}, directoryUpdateObj, function(err) {

						if (err) {
							res.render('error', { error: 'Error updating business listing ' + id, errorStack: err.stack} );
						} else {  //update
							console.log("inside directory.update insert method");
							res.render('success', { message: 'Update', title: 'eDirectory | Updated Business'}); //redirect the user to success page if the update process is completed successfully
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
 *	description	:	Get the requested business directory listing and display them in the edit form
 */
app.get('/edit-directory/:id', function (req, res, next) {
    
	//get the id from the request parameter to edit the business listing
    var id = req.params.id;

    //use the Directory model to look up the business directory with this id    
    Directory.findById(id, function (err, directory) {
        if (err) {
            var report = new Error('Directory listing not found' + id);
			report.status = 500;
            report.inner = err;
			return next(report);
        }
        else {
            res.render('edit-directory', { directory: directory, title: 'eDirectory | Browse Business'}); // record found and redirecting to display the business listing information 
        }
    });
});

/**	
 *	requestType	:	/GET
 *	paramId		:	id
 *	routeName	:	/delete-directory/:id
 *	description	:	Delete the requested business directory listing from the database
 */
app.get('/delete-directory/:id', function (req, res, next) {
    
	// get the business listing id from the request parameter
    var id = req.params.id;

    //use the directory model to look up the business listing with above id and remove the document
    Directory.findByIdAndRemove(id, function (err, directory) {
        
		//error
		if (err) {
            var report = new Error('Error finding the business directory listing from the database');
			report.status = 500;
            report.inner = err;
			return next(report);
        }
        else {
            res.render('success', { message: 'Delete', title: 'eDirectory | Delete Business'}); // record deleted successfully and redirecting to confirmation page
			res.end(); // end of response
        }
    });
});

//export the app object so that the entire application can use it
module.exports = app;
