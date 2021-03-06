const express = require( "express" );
const mongoose = require( "mongoose" );
const passport = require( "passport" );
const router = express.Router();

// Import model
const CompleteTask = require( "../models/completedTask" );
const User = require( "../models/user" );

// ADD Complete Task

router.post(
    "/Task",
    passport.authenticate( "User", { session: false } ),
    ( req, res, next ) => {
        const completeTask = {};
        completeTask.userId = req.user.id;
        completeTask.taskId = req.body.taskId;
        completeTask.Status = req.body.Status;
        completeTask.StartTime = req.body.StartTime;
        completeTask.EndTime = req.body.EndTime;
        completeTask.Comment = req.body.Comment;

        CompleteTask.findOne( { userId: req.user.id } )
            .then( ( result ) => {

                return new CompleteTask( completeTask )
                    .save()
                    .then( ( response ) => res.json( response ) );

            } )
            .catch( ( err ) => res.status( 500 ).json( err ) );
    }
);

// Get Complete Task
router.get(
    "/listTask",
    passport.authenticate( "User", { session: false } ),
    ( req, res, next ) => {
        CompleteTask.findOne( { userId: req.user.id } )
            .select( "_id userId taskId Status StartTime EndTime Comment" )
            .populate( "userId", "name" )
            .populate( "taskId", "taskAssign" )
            .then( ( result ) => {
                res.json( result );
            } )
            .catch( ( err ) => console.log( err ) );
    }
);

router.get(
    "/AdminListTask",
    passport.authenticate( "Admin", { session: false } ),
    ( req, res, next ) => {
        CompleteTask.find()
            .select( "_id userId taskId Status StartTime EndTime Comment" )
            .populate( "userId", "name" )
            .populate( "taskId", "taskAssign" )
            .then( ( result ) => {
                res.json( result );
            } )
            .catch( ( err ) => console.log( err ) );
    }
);

router.get(
    "/getUserTask/:Id",
    passport.authenticate( "User", { session: false } ),
    ( req, res, next ) => {
        const id = req.params.Id;
        // CompleteTask.findOne( { userId: req.user.id } )
        CompleteTask.findById( { _id: id } )
            .select( "_id userId taskId Status StartTime EndTime Comment" )
            .populate( "userId", "name" )
            .then( ( result ) => {
                res.json( result );
            } )
            .catch( ( err ) => console.log( err ) );
    }
);

router.get(
    "/getAdminTask/:Id",
    passport.authenticate( "Admin", { session: false } ),
    ( req, res, next ) => {
        const id = req.params.Id;
        // CompleteTask.findOne( { userId: req.user.id } )
        CompleteTask.findById( { _id: id } )
            .select( "_id userId taskId Status StartTime EndTime Comment" )
            .populate( "userId", "name" )
            .populate( "taskId", "taskAssign" )
            .then( ( result ) => {
                res.json( result );
            } )
            .catch( ( err ) => console.log( err ) );
    }
);

// Edit Complete Task
router.patch( "/editTask/:Id", ( req, res, next ) => {
    const id = req.params.Id;
    CompleteTask.findOneAndUpdate(
        {
            _id: id,
        },
        {
            $set: {
                Status: req.body.Status,
                StartTime: req.body.StartTime,
                EndTime: req.body.EndTime,
                Comment: req.body.Comment,

            },
        }
    )
        .exec()
        .then( ( result ) => {
            res.status( 200 ).json( result );
        } )
        .catch( ( err ) => {
            console.log( err );
        } );
} );

// Delete Complete Task
router.delete(
    "/deleteTask/:Id",
    passport.authenticate( "Admin", { session: false } ),
    ( req, res, next ) => {
        const id = req.params.Id;
        CompleteTask.findByIdAndDelete( { _id: id } )
            .then( ( result ) => {
                res.json( result );
            } )
            .catch( ( er ) => console.log( err ) );
    }
);

module.exports = router;