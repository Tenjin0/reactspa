var config = require("../config")

require('../models').connect(config.dbUri["development"]);

var User = require('../models/user');
User.find({}, (err, users) => {
    if (users.length === 0) {
        var roles = User.schema.obj.role.enum;
        var aasync = 0;
        for (var i = 0; i < roles.length; i++) {
            var user = new User({
                "email": roles[i] + "@gmail.com",
                "username": roles[i] ,
                "password": "test",
                "firstname": roles[i] ,
                "lastname":roles[i] ,
                "role": roles[i]  
            });
            user.save((err, user) => {
                aasync++;
                if (aasync === roles.length) {
                    process.exit();
                }
            });
            
        }
    }
});

