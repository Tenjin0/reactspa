var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema(
    {
        firstname : {
            type : String,
            required: true
        },
        lastname : {
            type : String,
            required: true
        },
        username : {
            type : String,
            lowercase: true
        },
        email : {
            type : String,
            lowercase: true,
            unique: true,
            required: true
        },
        password : {
            type : String,
            required: true
        },
        role: {
            type: String,
            enum: ['Student', 'Trainer',  'Admin'],
            default: 'Student'
        }
    }
);

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

UserSchema.pre('save', function saveHook(next) {
    const user = this;

    if(!user.isModified('password')) return next();
    
    bcrypt.genSalt((saltError, salt) => {
        if (saltError) return next(saltError);

        bcrypt.hash(user.password, salt, (hasError, hash )=> {
            user.password = hash;
            return next();
        });
    });
});

module.exports =  mongoose.model('User', UserSchema); 
