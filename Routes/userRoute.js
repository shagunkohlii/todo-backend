const express = require("express")
const router = express.Router()
const USER = require('../Models/User')

router.post('/signup', async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const existingUser = await USER.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "user already existed" })
        }

        const userData = await USER.create({
            userName, email, password
        })
        console.log(userData)
        return res.status(200).json({ message: "user created successfully", userData })
    } catch (error) {
        console.error("error in signup", error)
        return res.status(500).json({ error: "internal server error" })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await USER.matchPasswordAndGenerateToken(email, password);
        console.log("token", token);
        return res.json({ success: true, token });

    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;