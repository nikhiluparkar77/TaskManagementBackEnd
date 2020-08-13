const express = require( "express" );
const mongoose = require( "mongoose" );
const passport = require( "passport" );
const router = express.Router();

// Import model
const CompleteTask = require( "../models/completedTask" );

// ADD Complete Task
// router.post(
//     "/completeTask",
//     passport.authenticate( "User", { session: false } ),
//     ( req, res, next ) => {
//         const completeTask = new CompleteTask( {
//             userId: req.user.id,
//             taskId: req.body.taskId,
//             Status: req.body.Status,
//             StartTime: req.body.StartTime,
//             EndTime: req.body.EndTime,
//             Comment: req.body.Comment,
//         } );

//         completeTask
//             .save()
//             .then( ( result ) => res.json( result ) )
//             .catch( ( err ) => console.log( err ) );
//     }
// );


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
                if ( result ) {
                    return res.status( 400 ).json( { message: "Profile Already avilable" } );
                } else {
                    return new CompleteTask( completeTask )
                        .save()
                        .then( ( response ) => res.json( response ) );
                }
            } )
            .catch( ( err ) => res.status( 500 ).json( err ) );
    }
);

// Get Complete Task
router.get(
    "/listTask",
    // passport.authenticate( "User", { session: false } ),
    ( req, res, next ) => {
        // CompleteTask.findOne( { userId: req.user.id } )
        CompleteTask.find()
            .select( "_id userId taskId Status StartTime EndTime Comment" )
            .populate( "userId", "name" )
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
    passport.authenticate( "User", { session: false } ),
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