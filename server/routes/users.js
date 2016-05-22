"use strict";
/*
    File Name: users.ts
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Routing for user
*/
var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var User = userModel.User;
//utility function to check if user is authenticated
function requireAuth(req, res, next) {
    //check if user is log in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
// GET - show main users page - list all the users
router.get('/', requireAuth, function (req, res, next) {
    // use the Users model to query the Users collection
    User.find(function (error, users) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('users/index', {
                title: 'Users',
                users: users,
                displayName: req.user ? req.user.displayName : '',
                type: req.user ? req.user.type : ''
            });
        }
    });
});
// GET my account page - show the current user in the form
router.get('/myaccount', requireAuth, function (req, res, next) {
    var id = req.user._id;
    User.findById(id, function (error, User) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('users/edit', {
                title: 'My Account',
                user: User,
                displayName: req.user ? req.user.displayName : '',
                type: req.user ? req.user.type : ''
            });
        }
    });
});
// POST edit page - update the selected user
router.post('/myaccount', requireAuth, function (req, res, next) {
    // grab the id from the url parameter
    var id = req.user._id;
    // create and populate a user object
    var user = new User({
        _id: id,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName,
        type: req.body.type
    });
    // run the update using mongoose and our model
    User.update({ _id: id }, user, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //if success update
            res.redirect('/tickets');
        }
    });
});
// GET add page - show the blank form
router.get('/add', requireAuth, function (req, res, next) {
    res.render('users/add', {
        title: 'Add a New User',
        displayName: req.user ? req.user.displayName : '',
        type: req.user ? req.user.type : ''
    });
});
// POST add page - save the new user
router.post('/add', requireAuth, function (req, res, next) {
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName,
        type: req.body.type
    }, function (error, User) {
        // did we get back an error or valid Users object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/users');
        }
    });
});
// GET edit page - show the current user in the form
router.get('/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    User.findById(id, function (error, User) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('users/edit', {
                title: 'User Details',
                user: User,
                displayName: req.user ? req.user.displayName : '',
                type: req.user ? req.user.type : ''
            });
        }
    });
});
// POST edit page - update the selected user
router.post('/:id', requireAuth, function (req, res, next) {
    // grab the id from the url parameter
    var id = req.params.id;
    // create and populate a user object
    var user = new User({
        _id: id,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName,
        type: req.body.type
    });
    // run the update using mongoose and our model
    User.update({ _id: id }, user, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //if success update
            res.redirect('/users');
        }
    });
});
// GET delete user
router.get('/delete/:id', requireAuth, function (req, res, next) {
    // get the id from the url
    var id = req.params.id;
    // use the model and delete this record
    User.remove({ _id: id }, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/users');
        }
    });
});
// make this public
module.exports = router;

//# sourceMappingURL=users.js.map
