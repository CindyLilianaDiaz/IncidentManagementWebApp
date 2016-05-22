/* 
    File Name: users.ts 
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Schema Model for users
*/
import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');

// DEFINE THE OBJECT SCHEMA
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'username is required'
    },
    password: {
        type: String,
        default: '',
        trim: true,
        required: 'password is required'
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'email is required'
    },
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display Name is required'
    },
    type: {
        type: String,
        enum : ['Admin', 'Customer'],
        trim: true,
        required: 'Type is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
},
    { collection: 'userInfo' });

var options = ({missingPasswordError: "Wrong password"});
userSchema.plugin(passportLocalMongoose, options);
// MAKE THIS PUBLIC SO THE CONTROLLER CAN SEE IT
export var User = mongoose.model('User', userSchema);