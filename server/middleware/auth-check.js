var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function (req, res, next) {

    // if (!req.headers.authorization) {
    //     return res.status(401).json({message: "Headers authorization missing"}).end();
    // }
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if(err) {
                return res.status(401).json(err);
            }
            return User.findOne({_id : decoded.id}, function(err, user) {
                if (err) {
                    return res.status(401).json(err);
                }
                if (!user) return res.status(401).json({message: "no user found for this token"});
                req.user = user;
                next();
            });
        });
    } else {
        res.status(401).json({message: "no token"});
    }
};