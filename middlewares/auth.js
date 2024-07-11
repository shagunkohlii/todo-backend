const { validateToken } = require("../services/authentication");


function checkForAuthenticationHeader(headerName) {
    return (req, res, next) => {
        const token = req.header(headerName);

        if (!token) {
            return next();
        }

        try {
            const userPayload = validateToken(token)
            req.user = userPayload.user;
        } catch (error) {
            return res.status(401).json({ error: "Authenticate using valid token" });
        }
        next();
    }
}

const fetchUser = async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
        return res.status(401).json({ error: "Authenticate using valid token" });
    }
    try {
        const data = validateToken(token)
        req.user = data;
        next()
    } catch (error) {
        res.status(401).json({ error: "Authenticate using valid token" });
    }
}

module.exports = { checkForAuthenticationHeader, fetchUser };
