const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Backend berhasil dijalankan");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});