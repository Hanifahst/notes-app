const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Log = require("../models/Log");

const SECRET_KEY = "notes_secret";

router.post("/register", async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";

    db.query(
        sql,
        [username, email, hashedPassword],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            await Log.create({
                activity: `${ username } register`
            });
        }
    );
});

router.post("/login", (req, res) => {
    const {
        email, 
        password
    } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.json({
                    message: "User tidak ditemukan"
                });
            }

            const user = results[0];

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match){
                return re.json({
                    message: "Password salah!"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    SECRET_KEY
                }
            );

            await Log.create({
                activity: `${ user.username} login`
            });

            res.json({
                message: "Login berhasil",
                token
            });
        }
    );
});

module.exports = router;