var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema(
    {
        id_user : {
            type : String
        },
        subject : {
            type : String,
            required: true
        },
        grade : {
            type     : Number
            // validate : {
            //     validator : Number.isInteger,
            //     message   : '{VALUE} is not an integer value'
            // }
        },
        comment : {
            type : String
        }
    }
);

module.exports =  mongoose.model('Note', NoteSchema); 