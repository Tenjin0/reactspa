var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Note = require('../models/note');

var getAverageNote = function(notes) {
    if (Array.isArray(notes)) {
        var sum = 0;
        for (var i = 0; i < notes.length; i++) {
            sum += notes[i].grade;
        }
        return Math.round(sum/ notes.length);
    }
    return null;
};

var foundNotes = function(req, opts, callback) {

    var params = {id_user: req.params.idStudent};
    if (opts && opts.unique){
        params._id = req.params.idNote;
    }
    Note.find(params, function(err, notes) {
        if(err){
            return callback({
                status: 500,
                success: false,
                message: 'Could not process the data.',
                error: err
            }, null);
        }
        if (!notes) {
            User.findOne({_id: req.params.idStudent}, function(err, user) {
                if(err){
                    return callback({
                        status: 500,
                        success: false,
                        message: 'Could not process the data.',
                        error: err
                    }, null);
                }

                if (!user) {
                    return callback({
                        status: 401,
                        success: false,
                        message: 'No student found. Check your data',
                        error: err
                    }, null);
                }

                if(user) {
                    return callback({
                        status: 401,
                        success: false,
                        message: 'No note found for the student. Check your data',
                        error: err
                    }, null);
                }
            });
        }

        callback(null, notes);
    });
};
router.get('/students', function(req, res) {
    if (req.user && req.user.role === "Student"){
        return res.status(401).json({success: false, message: "Do not have access to users list"});
    }

    User.find({role: 'Student'}, { password: 0 },  function(err, users) {
        
        return res.json({success: true, students: users}).end();
    });
});

router.get('/students/:id', function(req, res) {
    if (req.user && req.user.role === "Student"){
        return res.status(401).json({success: false, message: "Do not have access to users list"});
    }
    User.findOne({_id: req.params.id},{ password: 0},   function(err, user) {
        if (!user) return res.status(404).json({success: false, message: "No user found with this id"}).end();
        if (user.role !== "Student")  return  res.status(401).json({success: false, message: "Do not have access to user information"}).end();
        return res.json({success: true, student: user}).end();
    });
});

router.get('/trainers', function(req, res) {
    if (req.user && req.user.role !== "Admin"){
        return res.status(401).json({success: false, message: "Do not have access to users list"});
    }

    User.find({role: "Trainer"},{ password: 0 },  function(err, users) {
        for (var i = 0; i < users.length; i++) {
            delete users[i].password;            
        }
        return res.json({success: true, trainers: users}).end();
    });
});

router.get('/profile', function(req, res) {
    var promise = User.findOne({_id: req.user.id}, { password: 0 }).exec();

    return promise.then((user)=> {
        res.json({success: true, profile: user}).end();
    }).catch((err) => {
        res.status(500).json({
            success: false,
            message: 'Could not process the data.'
        });
    });
});

router.put('/profile', function(req, res) {

    // FindAndUpdate do not trigger pre save hook 
    User.findOne({_id: req.user.id},{ password: 0 }, function(err, user) {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        }
        // TODO recuperer les champs dans le schema et faire une boucle
        if (req.body.firstname && req.body.firstname.trim().length > 0) {
            user.firstname = req.body.firstname.trim();
        }

        if (req.body.lastname && req.body.lastname.trim().length > 0) {
            user.lastname = req.body.lastname.trim();
        }

        if (req.body.username && req.body.username.trim().length > 0) {
            user.username = req.body.username.trim();
        }
        if (req.body.password && req.body.password.trim().length > 0 
        && req.body.confirmPassword && req.body.confirmPassword.trim().length > 0 && req.body.password.trim() === req.body.confirmPassword.trim()
         ) {
            user.password = req.body.password.trim();
        }
        user.save(function(err, user){
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Could not process the data.'
                });
            }
            return res.json({success: true, profile:user, message: "Profile has been sucessfully updated"});

        });
    });
});

// recuperer les informations d'une personne seulement pour les admins'
router.get('/', function(req, res) {
    if (req.user &&  req.user.role ==="Admin") {

        var promise = User.find({},{ password: 0 }  ).exec();
        
        return promise.then((users)=> {
            res.json({success: true, users: users}).end();
        }).catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        });
    }
    return res.json({success: false, message : "Do not have authorization to access this data"});
});
// recuperer les informations d'une personne seulement pour les admins'
router.get('/:id', function(req, res) {
    if (req.user &&  req.user.role ==="Admin") {

        var promise = User.findOne({_id: req.param.id},{ password: 0 }  ).exec();
        
        return promise.then((user)=> {
            res.json({success: true, profile: user}).end();
        }).catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        });
    }
    return res.json({success: false, message : "Do not have authorization to access this data"});
});

router.put('/:id', function(req, res) {
    if (req.user && req.user.role === 'Admin') {
        User.findOne({_id: req.params.id}, function(err, userData){
            if(err){
                return res.status(500).json({succes: false, message: "Could not process the data."});
            }
            if (req.body.firstname && req.body.firstname.trim().length > 0) {
                userData.firstname = req.body.firstname;
            }
            
            if (req.body.lastname && req.body.lastname.trim().length > 0) {
                userData.lastname = req.body.lastname;
            }

            if (req.body.username && req.body.username.trim().length > 0) {
                userData.username = req.body.username;
            }
            if (req.body.password && req.body.password.trim().length > 0 
            && req.body.confirmPassword && req.body.confirmPassword.trim().length > 0 && req.body.password.trim() === req.body.confirmPassword.trim()
            ) {
                userData.password = req.body.password.trim();
            }
            userData.save(function(err, user){
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Could not process the data.'
                    });
                }
                return res.json({success: true, user:user});
            });
        });
    } else {
        res.status(401).json({success: false, message: "Do not have authorization to access this data"});
    }
});

router.get('/profile/notes', function(req, res) {
    if (req.user && req.user.role !== "Student"){
        return res.status(401).json({success: false, message: "Do not have access to users list"});
    }
    Note.find({id_user: req.user._id}, function(err, notes) {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        }
        return res.json({success: true, notes: notes}).end();
    });

});

router.get('/student/:id/notes', function(req, res) {
    if (req.user && req.user.role === "Student"){
        return res.status(401).json({success: false, message: "Do not have access to notes list"});
    }
    User.findOne({_id: req.params.id},{ password: 0},   function(err, user) {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Could not process the data.'
            });
        }
        if (!user) return res.status(404).json({success: false, message: "No user found with this id"}).end();
        if (user.role !== "Student")  return  res.status(401).json({success: false, message: "Do not have access to user information"}).end();
        Note.find({}, function(err, notes) {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Could not process the data.'
                });
            }
            return res.json({success: true, notes: notes}).end();
        });
    });

});

router.post('/student/:id/notes', function(req, res) {
    if (req.user.role === 'Trainer') {

        req.checkBody('grade', 'grade is Required and should be between 0 and 20').notEmpty().isInt().gte(0).lte(20);
        req.checkBody('subject', 'subject is Required').notEmpty();

        var errors = (req.validationErrors()) ? req.validationErrors() : [];

        var isFormValid = errors.length === 0;

        if (!isFormValid) {
            return res.json( {success: isFormValid, message: "Check the data .", errors: errors});
        }

        User.findOne({_id: req.params.id},{ password: 0},   function(err, user) {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Could not process the data.'
                });
            }
            if (!user) return res.status(404).json({success: false, message: "No user found with this id"}).end();
            if (user.role !== "Student")  return  res.status(401).json({success: false, message: "Do not have access to user information"}).end();
            var noteData = {
                id_user: user._id,
                grade: req.body.grade,
                subject: req.body.subject,
            };
            if (req.body.comment) {
                noteData.comment = req.body.comment;
            }

            var newNote = new Note(
                noteData
            ).save(function(err, newNoteSaved){
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Could not process the data.',
                        error: err
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: 'The note has been saved.',
                    notes: newNoteSaved
                });
            });
        });
    } else {
        res.status(401).json({success: false, message: "Do not have access to user information"}).end();
    }

});

router.put('/student/:idStudent(\\w+)/notes/:idNote(\\w+)', function(req, res) {
    if(req.body.grade)
        req.checkBody('grade', 'grade is Required and should be between 0 and 20').notEmpty().isInt().gte(0).lte(20);
    if(req.body.subject)
        req.checkBody('subject', 'subject is Required').notEmpty();

    var errors = (req.validationErrors()) ? req.validationErrors() : [];

    var isFormValid = errors.length === 0;

    if (!isFormValid) {
        return res.json( {success: isFormValid, message: "Check the data .", errors: errors});
    }

    if (req.user.role === 'Trainer') {
        Note.findOne({id_user: req.params.idStudent, _id: req.params.idNote}, function(err, note){
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Could not process the data.',
                    error: err
                });
            }
            if (!note) return res.status(401).json({
                success: false,
                message: 'No note found for the student. Check your data'
            });

            if(req.body.grade)
                note.grade = req.body.grade;
            if(req.body.subject)
                note.subject = req.body.subject;
            note.save(function(err, noteModified){
                res.status(200).json({
                    success: true,
                    note :noteModified
                });
            });
        });
    } else {
        res.status(401).json({success: false, message: "Do not have access to user information"}).end();
    }
});

router.delete('/student/:idStudent(\\w+)/notes/:idNote(\\w+)', function(req, res) {
    if (req.user.role === 'Admin') {
       
        foundNotes(req, {unique: true}, function(err, notes){
            if(err) {
                return res.status(err.status).json(err).end();
            }
            var note= notes[0];
            // TODO soft delete
            return note.remove(function(err, note) {
                res.status(200).json({
                    success: true,
                    message: 'Note has been delete',
                    note : note
                });
            });
        });
    } else {
        res.status(401).json({success: false, message: "Do not have access to user information"}).end();
    }
});

router.get('/student/:idStudent(\\w+)/notes/average', function(req, res) {
    if (req.user.role !== 'Student') {
        foundNotes(req, {}, function(err, notes){
            if(err) {
                return res.status(err.status).json(err).end();
            }
            res.status(200).json({
                success: true,
                averageNote : getAverageNote(notes)
            });
        });
    } else {
        res.status(401).json({success: false, message: "Do not have access to user information"}).end();
    }
});
module.exports = router;
