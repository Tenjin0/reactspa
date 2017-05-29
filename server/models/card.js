var mongoose = require('mongoose');

var Tasks = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    done : {
        type : Boolean,
        required : true,
        default : false
    }
});

var CardSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required: true
        },
        description : {
            type : String,
            required: false
        },
        status : {
            type     : String,
            enum: ['todo', 'in-progress',  'done'],
            default: "todo"
        },
        tasks : [Tasks]
    }
);

module.exports =  mongoose.model('Card', CardSchema); 