const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const keys = require("../config/keys");

// import model
const Admin = require("../models/admin");
const User = require("../models/user");

// Admin register
router.post("/SignUp", (req, res, next) => {
  Admin.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Email Already Avilabele" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // reting
        d: "mm", // default
      });

      const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(admin.password, salt, (err, hash) => {
          if (err) throw err;
          admin.password = hash;
          admin
            .save()
            .then((admin) => res.json(admin))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// Admin login
router.post("/SignIn", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne({ email }).then((user) => {
    if (!user) {
      res.status(400).json({
        message: "User Not Found",
      });
    }
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };

          // Jwt Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 5600 },
            (err, token) => {
              res.json({
                message: "Login Successfully",
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json({
            message: "Passowrd Incorrect",
          });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
