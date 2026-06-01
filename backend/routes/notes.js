const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const auth = require("../middleware/authMiddleware");
const Log = require("../models/Log");

router.get("/", auth, (req, res) => {
    db.query(
        "SELECT id, content AS text FROM notes WHERE user_id=? ORDER BY updated_at DESC",
        [req.user.id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
});

router.post("/", auth, async (req, res) => {
    const { text } = req.body;

    db.query(
        "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
        [req.user.id, "Catatan", text],
        async (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            await Log.create({
                activity: `${req.user.username} menambah catatan`
            });

            res.json({
                message: "Catatan berhasil ditambahkan"
            });
        }
    );
});

router.put("/:id", auth, async (req, res) => {
    const { text } = req.body;

    db.query(
        "UPDATE notes SET content=? WHERE id=? AND user_id=?",
        [text, req.params.id, req.user.id],
        async (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            await Log.create({
                activity: `${req.user.username} mengedit catatan`
            });

            res.json({
                message: "Catatan berhasil diupdate"
            });
        }
    );
});

router.delete("/:id", auth, async (req, res) => {
    db.query(
        "DELETE FROM notes WHERE id=? AND user_id=?",
        [req.params.id, req.user.id],
        async (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            await Log.create({
                activity: `${req.user.username} menghapus catatan`
            });

            res.json({
                message: "Catatan berhasil dihapus"
            });
        }
    );
});

router.get("/search/:keyword", auth, (req, res) => {
    const keyword = `%${req.params.keyword}%`;

    db.query(
        "SELECT id, content AS text FROM notes WHERE user_id=? AND content LIKE ?",
        [req.user.id, keyword],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
});

module.exports = router;