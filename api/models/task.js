const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  taskAssign: {
    type: String,
    required: true,
  },
  StartTime: {
    type: Date,
  },
  EndTime: {
    type: Date,
  },
  Priority: {
    type: String,
  },
  Status: {
    type: String,
  },
});

module.exports = mongoose.model("TaskAssign", TaskSchema);
