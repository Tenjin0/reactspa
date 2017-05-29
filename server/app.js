const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const expressValidator = require('express-validator');
const index = require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');
const cards = require('./routes/card');

// connect to the database and load models

let isProd = process.env.NODE_ENV === 'production';

const app = express();

let webpack= require('webpack');
let configWebpack = require('../webpack.config');
let webpackDevMiddleware = require('webpack-dev-middleware')
let webpackHotMiddleware = require('webpack-hot-middleware')
let compiler = webpack(configWebpack);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", `http://localhost:3000`);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.use(webpackDevMiddleware(compiler, {
    publicPath: configWebpack.output.publicPath,
    noInfo: true
}));

if (!isProd) {
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
}

require('./models').connect(config.dbUri[app.get('env')]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/dist')));

//In this example, the formParam value is going to get morphed into form body format useful for printing. 
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
 
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    },
    customValidators: {
        isArray: function(value) {
            return Array.isArray(value);
        },
        gte: function(param, num) {
            return param >= num;
        },
        lte: function(param, num) {
            return param <= num;
        }
    }
}));

app.use(function(req, res, next) {
    // if(app.get('env') !== "test" && req.url.indexOf('/socket.io/')< 0) {
    //     console.log('query', req.query);
    //     console.log('params', req.params);
    //     console.log('body', req.body);
    // }
    next();
});

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/*',authCheckMiddleware);

app.use("/", index)
app.use('/auth', auth);
app.use('/api/users', user);
app.use('/api/cards', cards);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.json({success: false, message:"Route not found", 'error':  err.message});
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
});

module.exports = app;
