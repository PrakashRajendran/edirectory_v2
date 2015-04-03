/* 
	@author	Prakash Rajendran 
	ver	1.0
	date : 03/04/2015
	file name : directoryModel.js
	Description: This is Directory Schema model which defines the document properties 
	requests from the client to server
*/

/** 
 * Define the schema for mongoose model
 */
 
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Define the document properties for DirectorySchema
 */

var DirectorySchema = new Schema({
  businessName: { type: String },
  businessDescription: { type: String },
  businessOwner: { type: String },
  businessLogoUrl: { type: String },
  businessPhoneNo: { type: String },
  businessWebsite: { type: String },
  businessAddress: { type: String },
  businessEmail: { type: String }
});

var Directory =  mongoose.model('Directory', DirectorySchema);

// make this available to our users in our Node applications
module.exports = Directory;
