const express = require( "express" );
const router = express.Router();
const gravatar = require( "gravatar" );
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcrypt" );
const passport = require( "passport" );
const keys = require( "../config/keys" );

// import model
const User = require( "../models/user" );

// user register

router.post(
  "/SignUp",
  passport.authenticate( "Admin", { session: false } ),
  ( req, res, next ) => {
    User.findOne( { email: req.body.email } ).then( ( user ) => {
      if ( user ) {
        return res.status( 400 ).json( { message: "Email Already Avilabele" } );
      } else {
        const avatar = gravatar.url( req.body.email, {
          s: "200", // size
          r: "pg", // reting
          d: "mm", // default
        } );

        const user = new User( {
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
          joinDate: req.body.joinDate,
          resignDate: req.body.resignDate,
        } );

        bcrypt.genSalt( 10, ( err, salt ) => {
          bcrypt.hash( user.password, salt, ( err, hash ) => {
            if ( err ) throw err;
            user.password = hash;
            user
              .save()
              .then( ( user ) => res.json( user ) )
              .catch( ( err ) => console.log( err ) );
          } );
        } );
      }
    } );
  }
);

// user login
router.post( "/SignIn", ( req, res, next ) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne( { email } ).then( ( user ) => {
    if ( !user ) {
      res.status( 400 ).json( {
        message: "User Not Found",
      } );
    }
    bcrypt
      .compare( password, user.password )
      .then( ( isMatch ) => {
        if ( isMatch ) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            joinDate: user.joinDate,
            resignDate: user.resignDate,
          };

          // Jwt Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 5600 },
            ( err, token ) => {
              res.json( {
                message: "Login Successfully",
                token: "Bearer " + token,
              } );
            }
          );
        } else {
          return res.status( 400 ).json( {
            message: "Passowrd Incorrect",
          } );
        }
      } )
      .catch( ( err ) => console.log( err ) );
  } );
} );

// Edit User
router.patch(
  "/Edit/:userId",
  passport.authenticate( "jwt", { session: false } ),
  ( req, res, next ) => {
    const id = req.params.userId;
    User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          joinDate: req.body.joinDate,
          resignDate: req.body.resignDate,
        },
      }
    )
      .then( ( result ) => {
        res.json( result );
      } )
      .catch( ( err ) => console.log( err ) );
  }
);

// Get Single User
router.get(
  "/UserInfo/:userId",
  passport.authenticate( "jwt", { session: false } ),
  ( req, res, next ) => {
    const id = req.params.userId;
    User.findOne( { _id: id } )
      .select( "_id name email avatar password joinDate resignDate" )
      .then( ( result ) => {
        res.json( result );
      } )
      .catch( ( err ) => console.log( err ) );
  }
);

// Delete User
router.delete(
  "/Delete/:userId",
  passport.authenticate( "jwt", { session: false } ),
  ( req, res, next ) => {
    const id = req.params.userId;
    User.findByIdAndDelete( { _id: id } )
      .then( ( result ) => {
        res.json( {
          message: "Delete Successfully",
          result: result,
        } );
      } )
      .catch( ( err ) => console.log( err ) );
  }
);

// UserList
router.get(
  "/UserList",
  passport.authenticate( "Admin", { session: false } ),
  ( req, res, next ) => {
    User.find()
      .select( "_id name avatar email joinDate resignDate" )
      .then( ( user ) => {
        res.status( 200 ).json( user );
      } )
      .catch( ( err ) => console.log( err ) );
  }
);

module.exports = router;
