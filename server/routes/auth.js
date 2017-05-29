var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/register', function(req, res) {
    res.render('index');
});

router.post('/register', function(req, res, next) {
    var errors = [];
    let isFormValid = true;

    req.checkBody('username', 'username is Required').notEmpty();
    req.checkBody('email', 'Email is not Valid').isEmail();
    req.checkBody('password', 'password is Required').notEmpty();
    req.checkBody('confirmPassword', 'password do not match').equals(req.body.password);
    req.checkBody('firstname', 'firstname is Required').notEmpty();
    req.checkBody('lastname', 'lastname is Required').notEmpty();
    
    errors = (req.validationErrors()) ? req.validationErrors() : [];

    isFormValid = errors.length === 0;

    if (!isFormValid) {
        return res.json( {success: isFormValid, message: "Check the data .", errors: errors});
    }
    passport.authenticate('local-signup', (err) => {
        if(err)  {
            if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
                return res.status(409).json({
                    success: false,
                    message: 'Check the data for errors.',
                    errors: {
                        email: 'This email is already taken.'
                    }
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        }
        return res.status(201).json({
            success: isFormValid,
            message : "You have successfully signed up! Now you should be able to log in.",
            errors
        });
    })(req, res, next);    
});

router.post('/login', function(req, res, next) {
    var errors = [];
    let isFormValid = true;

    req.checkBody('email', 'Email is not Valid').isEmail();
    req.checkBody('password', 'password is Required').notEmpty();

    errors = (req.validationErrors()) ? req.validationErrors() : [];

    isFormValid = errors.length === 0;

    if (!isFormValid) {
        return res.status(400).json( {success: isFormValid, message: "Check the data .", errors: errors});
    }
    passport.authenticate('local-login', (err, token, userData) => {
        if(err)  {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        }
        
        return res.json({
            success: isFormValid,
            token,
            message : "You have successfully log in!",
            user: userData
        });
    })(req, res, next);    
});

module.exports = router;
