const express = require( "express" );
const router = express.Router();
const gravatar = require( "gravatar" );
const passport = require( "passport" );

// import model
const TaskAssign = require( "../models/task" );
const Admin = require( "../models/admin" );

router.post(
  "/taskAssign",
  passport.authenticate( "Admin", { session: false } ),
  ( req, res, next ) => {
    const assignTask = new TaskAssign( {
      userId: req.body.userId,
      taskAssign: req.body.taskAssign,
      StartTime: req.body.StartTime,
      EndTime: req.body.EndTime,
      Priority: req.body.Priority,
      Status: req.body.Status,
    } );

    assignTask
      .save()
      .then( ( result ) => res.json( result ) )
      .catch( ( err ) => console.log( err ) );
  }
);

router.get(
  "/",
  passport.authenticate( "Admin", { session: false } ),
  ( req, res, next ) => {
    TaskAssign.find()
      .select( "_id userId taskAssign StartTime EndTime Priority Status" )
      .populate( "userId", "name" )
      .then( ( result ) => {
        res.json( result );
      } )
      .catch( ( err ) => console.log( err ) );
  }
);

router.get(
  "/taskList",
  passport.authenticate( "User", { session: false } ),
  ( req, res, next ) => {
    TaskAssign.find( { userId: req.user.id } )
      .select( "_id userId taskAssign StartTime EndTime Priority Status" )
      .populate( "userId", "name" )
      .then( ( result ) => {
        res.json( result );
      } )
      .catch( ( err ) => console.log( err ) );
  }

);

router.get(
  "/getTaskList/:Id",
  passport.authenticate( "User", { session: false } ),
  ( req, res, next ) => {
    const id = req.params.Id;
    TaskAssign.findById( { _id: id } )
      .select( "_id userId taskAssign StartTime EndTime Priority Status" )
      .populate( "userId", "name" )
      .then( ( result ) => {
        res.json( result );
      } )
      .catch( ( err ) => console.log( err ) );
  }
);

router.delete(
  "/:taskId",
  passport.authenticate( "Admin", { session: false } ),
  ( req, res, next ) => {
    const id = req.params.taskId;
    TaskAssign.findByIdAndDelete( { _id: id } )
      .then( ( result ) => {
        res.json( result );
      } )
      .catch( ( er ) => console.log( err ) );
  }
);

module.exports = router;
