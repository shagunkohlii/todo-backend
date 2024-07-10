const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userTaskData: {
        type: Object
    }
}, { timestamps: true });


const USER = model("user", userSchema);

module.exports = USER