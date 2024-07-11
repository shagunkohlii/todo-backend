const { Schema, model } = require("mongoose")

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const TASK = model("task", taskSchema);

module.exports = TASK;