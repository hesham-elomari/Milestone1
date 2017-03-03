var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var StudentSchema1 = new mongoose.Schema({
	name1: {
		type: String,
		index:true
	},
	link: {
		type: String
	}
});


var Student1 = module.exports = mongoose.model('Student1',StudentSchema1);

module.exports.createStudent1 = function(newStudent1, callback){
	
	        newStudent1.save(callback);
	    };
	

