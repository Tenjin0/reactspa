const PassportLocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('./index.json');
module.exports = function(passport) {

    passport.use('local-signup', new PassportLocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
    }, (req, email, password, done) => {
        const userData = {
            email: email.trim(),
            password: password.trim(),
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim()
        };
        if (req.body.username) {
            userData.username = req.body.username.trim();
        }
        if (req.body.role) {
            userData.role = req.body.role.trim();
        }
        const newUser = new User(userData);
        newUser.save((err, user) => {
            if (err) { return done(err); }

            return done(null, user);
        });
    }));

    passport.use('local-login', new PassportLocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
    }, (req, email, password, done) => {
        const userData = {
            email: email.trim(),
            password: password.trim()
        };
        User.findOne({email: userData.email}, function(err, user) {
            if (err) {
                return done(err, user, userData);
            }
            if (!user) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';
                return done(error);
            }
            user.comparePassword(userData.password, function(err, isMatch) {
                if (!isMatch) {
                    const error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';
                    return done(error);
                }
                var payload = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    role: user.role
                };
                const token = jwt.sign(payload, config.jwtSecret);
                return done(err, token, payload);
            });
        }) ;
        // const userData = {
        //     email: email.trim(),
        //     password: password.trim(),
        //     name: req.body.username.trim()
        // };

        // const newUser = new User(userData);
        // newUser.save((err, user) => {
        //     if (err) { return done(err); }

        //     return done(null, user);
        // });
    }));
};
