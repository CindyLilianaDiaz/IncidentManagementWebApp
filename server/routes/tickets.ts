/* 
    File Name: tickets.ts 
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Routing for tickets
*/
import express = require('express');
var router = express.Router();

//DB references
import mongoose = require('mongoose');
import ticketModel = require('../models/ticket');
import Ticket = ticketModel.Ticket;

//Utility function to check if user is authenticated
function requireAuth(req: express.Request, res: express.Response, next: any){
    //check if user is log in
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}
//Utitlity to check ticket priority
function checkPriority(urgency,impact){  
    switch(urgency)
    {
        case 'LOW':
            if(impact == 'LOW'){
                return 5;
            }else if(impact == 'MEDIUM'){
                return 4;
            }else if(impact == 'HIGH'){
                return 3;
            }
            break;
        case 'MEDIUM':
            if(impact == 'LOW'){
                return 4;
            }else if(impact == 'MEDIUM'){
                return 3;
            }else if(impact == 'HIGH'){
                return 2;
            }
            break;
         case 'HIGH':
            if(impact == 'LOW'){
                return 3;
            }else if(impact == 'MEDIUM'){
                return 2;
            }else if(impact == 'HIGH'){
                return 1;
            }
            break;                     
    }
};
/* GET Tickets main page(Dashboard for admin, My tickets for customers) */
router.get('/', requireAuth,(req:express.Request, res:express.Response, next: any) =>{
    //Store what type of user is reuesting page
    var typeUser = req.user ? req.user.type : '';
    //Display proper page depending on type
    if( typeUser == 'Admin'){
        //Use the Ticket model to query the Tickets collection, sorting by High priorit
        Ticket.find({}).sort({'ticketPriority': 1}).exec(function(error, tickets){
            if(error){
                console.log(error);
                res.end(error);
            }
            else {
                //No error, render dashboard
                res.render('tickets/index',{
                    title: 'Dashboard',
                    tickets : tickets,
                    typeU: typeUser,
                    type: req.user.type,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });      
    }
    //User is a customer
    else{
        //Redirect to proper page
        res.redirect('/tickets/mytickets');
    }
});
/* GET My tickets page for customers) */
router.get('/mytickets', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    //Store user id of the user requesting page
    var userId = req.user ? req.user.username : ''; 
    //Use the Ticket model to query the Tickets collection, filtering by those Tickets created by the user, sorting by high priority
    Ticket.find({'createdBy' : userId}).sort({'ticketPriority': 1}).exec((error, tickets) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //No error, render page
            res.render('tickets/mytickets', {
                title: 'My Tickets',
                tickets: tickets,
                type: req.user.type, 
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

/* GET Closed tickets (Admin only) */
router.get('/closed', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    //Store user type
    var typeUser = req.user.type;
    //Render oage only if type is admin
    if( typeUser == 'Admin'){
        //Use the Ticket model to query the Tickets collection, filter tickets that are closed
        Ticket.find({'incidentNarrative.ticketStatus' : 'Closed'}).sort({'ticketPriority': 1}).exec((error, tickets) => {
            if (error) {
                console.log(error);
                res.end(error);
            }
            else {
                //Render page with only closed tickets
                res.render('tickets/closed', {
                    title: 'Closed Tickets',
                    tickets: tickets,
                    type: req.user.type, 
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    }
    //If user is customer we redirect to my tickets
    else {
        res.redirect('/tickets');
    }
});

/* GET add tickets */
router.get('/add', requireAuth,(req: express.Request, res: express.Response, next: any)=> {
    res.render('tickets/add', {
        title: 'Create New Ticket',
        type: req.user.type,
        displayName: req.user ? req.user.displayName : ''
    });
});


/* POST add page - save the new ticket*/
router.post('/add', requireAuth, (req: express.Request, res: express.Response, next: any) => { 
    //Store the username who created the ticket
    var createdBy = req.user ? req.user.username : ''; 
    //Determine what priority ticket will have
    var priority = checkPriority(req.body.ticketUrgency,req.body.ticketImpact);
    //Use the Ticket model to insert a new ticket into database
    Ticket.create({     
        ticketTitle: req.body.ticketTitle,
        createdBy: createdBy,
        ticketDescription: req.body.ticketDescription,              
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        ticketUrgency: req.body.ticketUrgency,
        ticketImpact: req.body.ticketImpact,
        ticketPriority: priority, 
        incidentNarrative : 
            {comment : 'Ticket submitted'} //Default first comment on incident narrative
    }, function(error, Ticket) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        //No error redirect to main tickets page 
        else {
            res.redirect('/tickets');
        }
    })
});

/* GET edit page - show the current ticket in the form*/
router.get('/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    //Store the id passed as parameter
    var id = req.params.id;
    //Store the type of user
    var typeUser = req.user ? req.user.type : '';
    //Display different edit page depending on type
    if( typeUser == 'Admin'){
        //Use the Ticket model to query the Tickets collection, find by id
        Ticket.findById(id, (error, Ticket) => {
            if (error) {
                console.log(error);
                res.end(error);
            }
            else {
                //Show the edit view
                res.render('tickets/edit', {
                    title: 'Ticket Details',
                    ticket: Ticket,
                    typeU: typeUser,
                    type: req.user.type,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    }
    //If is customer only show details
    else{
        Ticket.findById(id, (error, Ticket) => {
            if (error) {
                console.log(error);
                res.end(error);
            }
            else {
                //show the edit view
                res.render('tickets/details', {
                    title: 'Ticket Details',
                    ticket: Ticket,
                    typeU: typeUser,
                    type: req.user.type,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    }
});
// 
/* Process edit page - update the selected ticket*/
router.post('/:id', requireAuth,(req: express.Request, res: express.Response, next: any) => {
    // Store the id from the url parameter
    var id = req.params.id;
    var priority = checkPriority(req.body.ticketUrgency,req.body.ticketImpact);
    var urgency = req.body.ticketUrgency;
    var impact = req.body.ticketImpact;
    var incidentComment = req.body.comment;
    var incidentStatus = req.body.ticketStatus;
    //Update fields that can be altered
    Ticket.update({ _id: id},{$set:{ticketUrgency: urgency, ticketImpact: impact, ticketPriority:priority }}, error =>{
        if (error) {
            console.log(error);
            res.end(error);
        }
    });
    //Run an update query for the embedded document
    Ticket.update({ _id: id }, {$push: {incidentNarrative:{comment : incidentComment, ticketStatus :incidentStatus}}}, (error) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //No error, redirect back to main tickets page
            res.redirect('/tickets');
        }
    });
});
//Export content
module.exports = router;