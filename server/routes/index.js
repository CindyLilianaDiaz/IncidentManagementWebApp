"use strict";
/*
    File Name: index.ts
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Routing for index
*/
var express = require('express');
//Email  set up
var sendgrid = require('sendgrid')('xxxx', 'xxxxx');
var passport = require('passport');
var router = express.Router();
// DB references
var userModel = require('../models/user');
var User = userModel.User;
/* GET home,landing page */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : ''
    });
});
/* GET Registration page */
router.get('/register', function (req, res, next) {
    //Check if user is not login already
    if (!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : '',
            type: req.user ? req.user.type : ''
        });
        return;
    }
    else {
        return res.redirect('/');
    }
});
/* Process Registration Request */
router.post('/register', function (req, res, next) {
    //Attempt to register user
    User.register(new User({ username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName,
        type: req.body.type
    }), req.body.password, function (err) {
        if (err) {
            console.log('Error Inserting New Data');
            if (err.name == 'UserExistsError') {
                req.flash('registerMessage', 'Registration Error: User Already Exists!');
            }
            return res.render('register', {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : '',
                type: req.user ? req.user.type : ''
            });
        }
        //If registration is successful
        return passport.authenticate('local')(req, res, function () {
            res.redirect('/tickets');
        });
    });
});
/* Process Logout Request */
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
});
/* GET contact page. */
router.get('/contact', function (req, res, next) {
    req.flash('successmessage', 'Thank You. Your message has been sent.');
    req.flash('errormessage', 'An Error has occurred.');
    res.render('contact', {
        title: 'Contact',
        messages: null,
        displayName: req.user ? req.user.displayName : '',
        type: req.user ? req.user.type : ''
    });
});
/* Processing  contact page*/
router.post('/contact', function (req, res, next) {
    sendgrid.send({
        to: 'cindy.liliana.diaz@hotmail.com',
        from: req.body.email,
        subject: 'Contact Form Submission',
        text: "This message has been sent from the contact form at [MongoDB Demo]\r\n\r\n" +
            "Name: " + req.body.name + "\r\n\r\n" +
            "Phone: " + req.body.phone + "\r\n\r\n" +
            req.body.message,
        html: "This message has been sent from the contact form at [MongoDB Demo]<br><br>" +
            "<strong>Name:</strong> " + req.body.name + "<br><br>" +
            "<strong>Phone:</strong> " + req.body.phone + "<br><br>" +
            req.body.message
    }, function (err, json) {
        if (err) {
            res.status(500).json('error');
        }
        res.render('contact', {
            title: 'Contact',
            messages: req.flash('successmessage')
        });
    });
});
/* GET Login Page */
router.get('/login', function (req, res, next) {
    //Check if user is login
    if (!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : '',
            type: req.user ? req.user.type : ''
        });
        return;
    }
    else {
        return res.redirect('/tickets');
    }
});
/* Process Login Request */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/tickets',
    failureRedirect: '/login',
    failureFlash: true
}));
//Export contents
module.exports = router;

//# sourceMappingURL=index.js.map
