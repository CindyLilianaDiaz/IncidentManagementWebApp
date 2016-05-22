/* 
    File Name: tickets.ts 
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Schema Model for support ticket
*/
import mongoose = require('mongoose');

// Define object schema
var ticketSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy:{
        type: String,
        default: '',
        trim: true,
        required: 'Created by is required'     
    },
    ticketNumber: {
        type: String,
        default: Date.now  
    },
    ticketTitle: {
        type : String,
        default: '',
        trim: true,
        required: 'Ticket Title is required'
    },
    ticketDescription: {
        type : String,
        default: '',
        trim: true,
        required: 'Ticket Description is required'
    },
    ticketUrgency:{
        type: String,
        enum : ['HIGH', 'MEDIUM', 'LOW'],
        default : 'LOW',
        trim: true,
        required: 'Ticket Urgency is required'
    },
    ticketImpact : {
        type: String,
        enum : ['HIGH', 'MEDIUM', 'LOW'],
        default : 'LOW',
        trim: true,
        required: 'Ticket Impact is required'
    },
    ticketPriority: {
        type: Number,
        enum : [1, 2, 3, 4, 5],
        default : 5,
        trim: true,
        required: 'Ticket Priority is required'
    },
    customerName: {
        type : String,
        default: '',
        trim: true,
        required: 'Customer Name is required'
    },
    customerPhone: {
        type : String,
        default: '',
        trim: true,
        required: 'Customer Phone is required'
    },
    //Embedded document, incident narrative
    incidentNarrative : [{
        commentDate : {
            type: Date,
            default: Date.now
            },
        comment: String,
        ticketStatus : {
            type: String,
            enum : ['New', 'Picked Up', 'Assigned', 'Resolved', 'Closed'],
            default : 'New',
            trim: true,
            required: 'Ticket Status is required'
        }
    }]
});
//Export ticket model
export var Ticket = mongoose.model('Ticket', ticketSchema);