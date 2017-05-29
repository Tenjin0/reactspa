const jwt = require('jsonwebtoken');
const config = require('../config/index.json');

module.exports  = function(User,Note, callback) {
    var roles = User.schema.obj.role.enum;
    var async = 0;
    var users = {};
    for (var i = 0; i < roles.length; i++) {
        new (User({
            "email": roles[i] + "@gmail.com",
            "username": roles[i] ,
            "password": "test",
            "confirmPassword": "test",
            "firstname": roles[i] ,
            "lastname":roles[i] ,
            "role": roles[i] 
        })).save(function(err, user) {
            var payload = {
                id : user._id
            };
            // console.warn(user, jwt.sign(payload, config.jwtSecret));
            users[roles[this.i]] = {
                user: user,
                token: jwt.sign(payload, config.jwtSecret)
            };
            if(roles[this.i] === "Student") {
                return new Note({
                    id_user: user._id,
                    grade: 19,
                    subject: "Math",
                    comment:"Very good"
                }).save(function(err, note) {
                    async++;
                    users[roles[this.i]].note = note;
                    if(async === roles.length) {
                        callback(null, users);
                    }
                }.bind({i: this.i}));            
            } else {
                async++;
                if(async === roles.length) {
                    callback(null, users);
                }
            }
        }.bind({i}));        
    }
};
