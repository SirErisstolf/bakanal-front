var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                {	console.log("error: " + err);
                	return done(err);
                }
                    

                // if no user is found, return the message
                if (!user)
                {
                	console.log("'No user found.'");
                	return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                    

                if (!user.validPassword(password))
                {
                	console.log( 'Oops! Wrong password.');
                	return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                    

                // all is well, return user
                else
                {  
                	console.log("logged in");
                	return done(null, user);
                }
                  
            });
        });

    }));

    }
