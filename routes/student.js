var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Student = require('../models/student');
var Student1 = require('../models/student1');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });



router.get('/register', function(req, res){
	res.render('register');
});


router.get('/login', function(req, res){
	res.render('login');
});

router.post('/links',function(req,res){
	
	
	var name1 = req.body.name1;
	var link = req.body.link;
	

	req.checkBody('name1', 'Name is required').notEmpty();
	req.checkBody('link', 'Link is required').notEmpty();
	

	var errors = req.validationErrors();

	if(errors){
		res.render('CP',{
			errors:errors
		});
	} else {
		var newStudent1 = new Student1({
			name1: name1,
			link: link
		});

		newStudent1.save(function(err, res){});

		

		req.flash('success_msg', 'Your work is saved');

		res.redirect('/CP');
	}	
db.close();
});



router.post('/register', function(req, res){
	
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newStudent = new Student({
			username: username,
			password: password
		});

		Student.createStudent(newStudent, function(err, student){
			if(err) throw err;
			console.log(student);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/student/login');
	}
});

passport.use(new LocalStrategy(function(username, password, done) {
   Student.getStudentByUsername(username, function(err, student){
   	if(err) throw err;
   	if(!student){
   		return done(null, false, {message: 'Unknown Student'});
   	}

   	Student.comparePassword(password, student.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, student);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(student, done) {
  done(null, student.id);
});

passport.deserializeUser(function(id, done) {
  Student.getStudentById(id, function(err, student) {
    done(err, student); 
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/CP', failureRedirect:'/student/login',failureFlash: true}),
  function(req, res) {
    res.render('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/student/login');
});

module.exports = router;
