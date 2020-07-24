const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const passport = require("passport");

// import model
const Task = require("../models/task");

router.post(
  "/TaskAssign",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const task = {};
    task.adminId = req.admin.id;
    task.userId = req.body.userId;
    task.taskAssign = req.body.taskAssign;
    task.StartTime = req.body.StartTime;
    task.EndTime = req.body.EndTime;
    task.Priority = req.body.Priority;
    task.Status = req.body.Status;

    Task.findOne({ adminId: req.admin.id })
      .then((result) => {
        new Task(task)
          .save()
          .then((response) => res.json(response))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
