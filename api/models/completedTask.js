const mongoose = require( "mongoose" );

const CompletedTaskSchema = mongoose.Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskAssign",
        required: true
    },
    Status: {
        type: String,
    },
    StartTime: {
        type: Date,
    },
    EndTime: {
        type: Date,
    },

    Comment: {
        type: String,
    },

} );

module.exports = mongoose.model( "CompleteTask", CompletedTaskSchema );