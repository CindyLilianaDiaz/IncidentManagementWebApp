"use strict";
/// <reference path = "./_reference.ts"/>
/*
    File Name: app.ts
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Setup for our application
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Add mongoose
var mongoose = require('mongoose');
//Components for user authentication
var userModel = require('./models/user');
var User = userModel.User;
var session = require('express-session');
//Flash messages
var flash = require('connect-flash');
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
//Import objects namespace
var objects = require('./objects/customerror');
var CustomError = objects.CustomError;
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
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', function (callback) {
    console.log('Connected to mongoLab');
});
//Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var error = new CustomError('Not Found');
    error.status = 404;
    next(error);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (error, req, res, next) {
        res.status(error.status || 500);
        res.render('error', {
            message: error.message,
            error: error
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
});
module.exports = app;

//# sourceMappingURL=app.js.map
