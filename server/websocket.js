let geoip = require('geoip-lite');
let useragent = require('useragent');
var User = require('./models/user');
var jwt = require('jsonwebtoken');
var config = require('./config');

module.exports  = function(io) {

    let users = {};

    // setInterval(() => {
    //     console.log(`Users online: ${userCount}`);
    // }, 10 * 1000);

    io.on('connection', (socket) => {
        let id = socket.id;
        
        let user = users[id] = {
            date : Date.now(),
            updated: Date.now()
        };
        console.warn(socket.id);
        socket.on('close', () => {
            delete users[id];
        });

        socket.on('update card', function(data, fn) {
            console.warn(data);
            socket.broadcast.emit('update card', data);
        })
        socket.on('add card', function(data, fn) {
            console.warn(32, data);
            socket.broadcast.emit('added card', data);
            // socket.broadcast('update card', { card : data });
        })
        socket.on('delete card', function(data, fn) {
            console.warn(37, data);
            socket.broadcast.emit('delete card', data);
            // socket.broadcast('update card', { card : data });
        })
        socket.on('authentificate', function(data, fn) {
            // console.warn(data);
            jwt.verify(data.id, config.jwtSecret, function(err, decoded) {
                if(err) {
                    // console.warn(err)
                    return;
                }
                return User.findOne({_id : decoded.id}, function(err, user) {
                    if (err) {
                        return;
                    }
                    users[user._id] = users[id]
                    delete users[id];
                    id = user._id;
                    users[id].auth = true
                    // socket.emit('users', {user : users})
                    auths = []
                    for (id in users) {
                        if (users[id].auth) {
                            auths.push(id);
                        }
                    }
                    socket.emit('usersAuth', {auths, auths})
                });
            });
        })
        socket.on('users', function(data, fn) {
            socket.emit('users', {user : users})
        })

        socket.on('url', function(data, fn) {
            users[id].url = data.url;
            socket.emit('users', {user : users})
        })

        socket.on('geo', function(data, fn) {
            users[id].position = data
            socket.emit('users', {user : users})
        })

        socket.on('usersAuth', function(data) {
            auths = []
            for (id in users) {
                if (users[id].auth) {
                    auths.push(id);
                }
            }
            socket.emit('usersAuth', {auths, auths})
        });
    });

    io.on('error', err => {
        console.error(err);
    });
};
