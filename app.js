var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
const sqlite = require('sqlite3');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authRouter = require('./routes/auth');
var signinRouter = require('./routes/signin');
var signupRouter = require('./routes/signup');
var logoutRouter = require('./routes/logout');
var gameRouter = require('./routes/game');

const flash = require('connect-flash');
const passport = require('passport');
var sequelize = require("./models/index").sequelize
const passportConfig = require('./passport');

require('dotenv').config();


var app = express();
app.gameInfo = { gameId: 0, outcome: "", gameRes: "" };
app.gameStartTime = parseInt(new Date().getTime() / 1000);
sequelize.sync();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

passportConfig(passport);
const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    proxy: false
});



app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
    app.use(logger('combine'))
} else {
    app.use(logger('dev'));
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'BJS')));


app.use('/', signinRouter);
app.use('/signup', signupRouter);
app.use('/game', gameRouter);
app.use('/auth', authRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = { app: app, sessionMiddleware: sessionMiddleware };