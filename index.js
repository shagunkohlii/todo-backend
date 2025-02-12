const express = require("express");
const app = express();
const cors = require("cors")
const userRoute = require('./Routes/userRoute')
const bodyParser = require("body-parser")
const { checkForAuthenticationHeader } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const taskRoute = require("./Routes/taskRoute")
// db connection
const mongoConnect = require('./db');
mongoConnect()

// middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3000', 'https://shagunkohli-todo.vercel.app'], methods: ["GET", "POST", "DELETE", "PUT"], credentials: true }))
app.use(checkForAuthenticationHeader("token"));
app.use(cookieParser())
app.use(bodyParser.json());

// route api
app.use("/api/user", userRoute)
app.use("/api/task", taskRoute)


// server
app.listen(PORT, () => {
    console.log("server started..at port 5000")
})