var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var StudentSchema = new mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	}
});


var Student = module.exports = mongoose.model('Student',StudentSchema);



module.exports.createStudent = function(newStudent, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newStudent.password, salt, function(err, hash) {
	        newStudent.password = hash;
	        newStudent.save(callback);
	    });
	});
}

module.exports.getStudentByUsername = function(username, callback){
	var query = {username: username};
	Student.findOne(query, callback);
}

module.exports.getStudentById = function(id, callback){
	Student.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


