/// <reference path = "./_reference.ts"/>
/* 
    File Name: app.ts 
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Setup for our application
*/
import express = require('express');
import path = require('path');
var favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
//Add mongoose
import mongoose = require('mongoose');

//Components for user authentication
import userModel = require('./models/user');
import User = userModel.User;
import session = require('express-session');

//Flash messages
import flash = require('connect-flash');
import passport = require('passport');
import passportLocal = require('passport-local');
import LocalStrategy = passportLocal.Strategy;

//Import objects namespace
import * as objects from './objects/customerror';
import CustomError = objects.CustomError;
var myerror = new CustomError();
//Declare routing
var routes = require('./routes/index');
var users = require('./routes/users');
var tickets = require('./routes/tickets');

var app = express();

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//Initialize Session
app.use(session({
    secret: 'someSecret',
    saveUninitialized: false,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Initialize Flash Messages
app.use(flash());

app.use(express.static(path.join(__dirname, '../public')));

//Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Route Definitions
app.use('/', routes);
app.use('/tickets', tickets);
app.use('/users', users);


//Connect to mongodb with mongoose
var DB = require('./config/db');
mongoose.connect(DB.url);

//Check connection
var db: mongoose.Connection = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', function(callback) {
    console.log('Connected to mongoLab');
});


//Catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: any) => {
    var error = new CustomError('Not Found');
    error.status = 404;
    next(error);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((error: CustomError, req: express.Request, res: express.Response, next: any) => {
        res.status(error.status || 500);
        res.render('error', {
            message: error.message,
            error: error
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((error: CustomError, req: express.Request, res: express.Response, next: any) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
});


module.exports = app;
