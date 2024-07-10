const mongoose = require('mongoose');
const mongoUrl = "mongodb://localhost:27017/todo-db";

const mongoConnect = async () => {
    try {
        await mongoose.connect(mongoUrl)
        console.log("mongodb connected..")
    } catch (err) {
        console.log("error in mongodb connection", err)
    }
}

module.exports = mongoConnect;