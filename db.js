const mongoose = require('mongoose');
const mongoUrl = `mongodb+srv://rishabkohli4:Priya126@cluster0.ukvbl6h.mongodb.net/todoist-db?retryWrites=true&w=majority&appName=Cluster0`;


const mongoConnect = async () => {
    try {
        await mongoose.connect(mongoUrl)
        console.log("mongodb connected..")
    } catch (err) {
        console.log("error in mongodb connection", err)
    }
}

module.exports = mongoConnect;