const jwt = require("jsonwebtoken");
const SECRET_KEY = "notes_secret";

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({
            message: "Token tidak ada"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        console.log(error);

        return res.json({
            message: "Token tidak valid"
        });
    }
}

module.exports = authMiddleware;