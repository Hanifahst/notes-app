const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
    activity: String,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Log", LogSchema);