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
    new jwtStrategy(opts, (jwt_payload, done) => {
      Admin.findById(jwt_payload.id).then((admin) => {
        if (admin) {
          return done(null, admin);
        }
        return done(null, false);
      });
    })
  );
};
