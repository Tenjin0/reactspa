var express = require('express');
var router = express.Router();
var Card = require('../models/card');

let findTask = (req, callback) => {
    Card.findOne({_id: req.params.idCard}, (err,card)=> {
        if (err) return callback({
            status: 500,
            success: false,
            message: 'Could not process the data.',
            error: err
        }, null);
        
        if(!card) {
            return callback({
                status: 401,
                success: false,
                message: "No Card found",
                card: null
            }, null);
        }

        let indexTask = card.tasks.findIndex((task) => {
            return task._id.toString() === req.params.idTask;
        });
        
        if(indexTask < 0) {
            return callback({status: 401, success: false, message: "No task found"}, null)
        }

        return callback(null, {
            response : {
                status: 200, success: true, message: "Task found", task:  card.tasks[indexTask]
            },
            card: card,
            indexTask : indexTask
        });
    });
};

router.get('/', (req, res) => {
    Card.find({}, (err, cards) => {
        if (err) return res.status(500).send({
            success: false,
            message: 'Could not process the data.',
            error: err
        }).end();

        res.status(200).send({success: true, message: "Retrieved Cards", cards}).end();
    });
});

router.put('/:idCard', (req, res) => {
    Card.findOne({_id: req.params.idCard}, (err, card) => {
        if (err) return res.status(500).send({
            success: false,
            message: 'Could not process the data.',
            error: err
        }).end();
        if (!card) {
            return res.status(401).send({success: false, message: "Card not found"}).end();
        }
        for (var key in req.body) {
            if (card[key]){
                card[key] = req.body[key];
            }
        }
        card.save((err, newCard)=> {
            if (err) return res.status(500).send({
                success: false,
                message: 'Could not process the data.',
                error: err
            }).end();
            // req.io.sockets.emit('new card', { card : card });
            res.status(200).send({success: true, message: "Card successfully changed", card: newCard}).end();
        });
    });
});

router.post('/', (req, res) => {
    var card = new Card(
        req.body
    );
    card.save((err, newCard) => {
        if (err) return res.status(500).send({
            success: false,
            message: 'Could not process the data.',
            error: err
        }).end();
        // req.io.sockets.emit('new card', { card : card });
        // req.io.sockets.broadcast('new card', { card : card });
        res.status(201).send({success: true, message: "Create a new Card", card: newCard}).end();
    });
});

router.get('/:idCard/tasks', (req, res)=> {
    Card.findOne({_id: req.params.idCard}, (err,card)=> {
        if (err) return res.status(500).send({
            success: false,
            message: 'Could not process the data.',
            error: err
        }).end();
        if(!card) {
            return  res.status(401).send({success: false, message: "No Card found", card: card}).end();
        }
        return res.status(200).send({success: true, message: "Card found", tasks: card.tasks}).end();
    });
});

router.get('/:idCard/tasks/:idTask', (req, res)=> {
    findTask(req, (err, response)=> {
        if (err) {
            return res.status(err.status).send(err).end();
        }
        return res.status(200).send(response.response).end();
    });
    
});

router.put('/:idCard/tasks/:idTask', (req, res)=> {
    findTask(req, (err, response)=> {
        if (err) {
            return res.status(err.status).send(err).end();
        }
        for (var key in req.body) {
            var element = req.body[key];
            response.response.task[key] = element;
        }
        response.card.save((err, card)=> {
            if (err) return res.status(500).send({
                success: false,
                message: 'Could not process the data.',
                error: err
            }).end();
            // req.io.sockets.emit('update card', { card : response.card });
            return res.status(200).send(response.response).end();
        });
    });
});

router.post('/:idCard/tasks', (req, res)=> {
    Card.findOne({_id: req.params.idCard}, (err,card)=> {
        if (err) return res.status(500).send({
            success: false,
            message: 'Could not process the data.',
            error: err
        }).end();
        if(!card) {
            return  res.status(401).send({success: false, message: "No Card found", card: card}).end();
        }
        if (req.body.name) {
            card.tasks.push({ name: req.body.name, done: false});
            card.save((err, cardSaved) => {
                if (err) return res.status(500).send({
                    success: false,
                    message: 'Could not process the data.',
                    error: err
                }).end();
                // req.socket.emit('update card', { card : card });
                return res.status(201).send({success: true, message: "new Task created", card: cardSaved}).end();
            });

        } else {
            return res.status(401).send({success: false, message: "Missing task name"}).end();
        }

    });
});

router.delete('/:idCard', (req, res) => {
    Card.remove({_id: req.params.idCard}, (err, card) => {
        if (err) return res.status(500).send({
            success: false,
            message: 'Could not process the data.',
            error: err
        }).end();
        if(card.n === 0) {
            return res.status(401).send({
                success: false,
                message: 'Card not found.'
            }).end();
        }
        // req.io.sockets.emit('delete card', { card : card });
        // req.io.sockets.broadcast('delete card', { card : card });
        return res.status(200).send({
            success: true,
            message: 'Card sucessfully deleted.',
            card :{
                _id: req.params.idCard
            }
        }).end();
    });
});

router.delete('/:idCard/tasks/:idTask', (req, res)=> {
    findTask(req, (err, response)=> {
        if (err) {
            return res.status(err.status).send(err).end();
        }
        response.card.tasks.splice(response.indexTask, 1);
        response.card.save((err, card)=> {
            if (err) return res.status(500).send({
                success: false,
                message: 'Could not process the data.',
                error: err
            }).end();
            // req.socket.emit('update card', { card : card });
            // req.socket.broadcast('update card', { card : card });
            return res.status(200).send({success: true, message: "Task has been successfully deleted", card: response.card }).end();
        });
    });
});

module.exports = router;

