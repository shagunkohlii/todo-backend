const express = require("express");
const app = express();
const cors = require("cors")
const userRoute = require('./Routes/userRoute')
const bodyParser = require("body-parser")
const PORT = 5000;
// db connection
const mongoConnect = require('./db')
mongoConnect()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// route api
app.use("/api/user", userRoute)

// server
app.listen(PORT, () => {
    console.log("server started..at port 5000")
})