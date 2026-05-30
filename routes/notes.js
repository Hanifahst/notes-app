const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const auth = require("../middleware/authMiddleware");
const Log = require("../models/Log");
const { Query, get } = require("mongoose");

router.get("/", auth, (req, res) =>{
    const sql = 
        "SELECT * FROM notes WHERE user_id=? ORDER BY updated_at DESC";
    
    db.query(sql, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

router.post("/", auth, async (req, res) => {
    const{ title, content } = req.body;
    const sql = 
        "INSERT INTO notes (user_id,title,content) VALUES (?,?,?)";

    db.query(
        sql,
        [req.user.id, title, content],
        async (err, result) => {

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
    const { title, content } = req.body;
    const sql = 
        "UPDATE notes SET title=?, content=? WHERE id=?";
    
    db.query(
        sql,
        [title, content, req.params.id],
        async (err, reslut) => {
            
            if (err) {
                return res.statis(500).json(err);
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
        "DELETE FROM notes WHERE id=?",
        [req.params.id],
        async (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            await Log.create({
                activity: `${req.user.username} menghapus catatan`
            });

            res.json({
                message: "catatan berhasil dihapus"
            });
        }
    );
});

router.get("/search/:keyword", auth, (req, res) => {
    const keyword = `%${req.paramss.keyword}%`;
    const sql = 
        "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ?";
    
    db.query(sql, [keyword, keyword], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

module.exports = router;