const jwt = require("jsonwebtoken");
const SECRET_KEY = "notes_secret";

function authMiddleware(req, res, next){
    const token = req.headers.authorization;

    if (!token) {
        return res.json({
            message: "Token tidak ada"
        });
    }

    try{
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error){
        res.json({
            message: "Token tidak valid"
        });
    }
}

module.exports = authMiddleware;