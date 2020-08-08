const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const Admin = mongoose.model("Admin");
const User = mongoose.model("User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    "Admin",
    new jwtStrategy(opts, (jwt_payload, done) => {
      Admin.findById(jwt_payload.id).then((admin) => {
        if (admin) {
          return done(null, admin);
        }
        return done(null, false);
      });
    })
  );

  passport.use(
    "User",
    new jwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id).then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );

  passport.serializeUser(function (entity, done) {
    done(null, { id: entity.id, type: entity.type });
  });

  passport.deserializeUser(function (obj, done) {
    switch (obj.type) {
      case "Admin":
        Student.findById(obj.id).then((admin) => {
          if (admin) {
            done(null, admin);
          } else {
            done(new Error("admin id not found:" + obj.id, null));
          }
        });
        break;
      case "User":
        User.findById(obj.id).then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(new Error("user id not found:" + obj.id, null));
          }
        });
        break;
      default:
        done(new Error("no entity type:", obj.type), null);
        break;
    }
  });
};
