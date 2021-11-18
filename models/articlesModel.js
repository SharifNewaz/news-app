const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
    author: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    url: { type: String, trim: true },
    publishedDate: { type: Date, trim: true },
    content: { type: String, trim: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Article", articleSchema);
