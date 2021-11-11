const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, require: true, trim: true, min: 2 },
    email: { type: String, required: true, trim: true, match: [/(^[a-zA-Z]{1,})((\d){1,}|[\_|\.|\-][a-zA-Z]{1,})?\@([a-zA-Z]{1,})\-?([a-zA-Z]{1,})?\.([a-zA-Z]{2,3})$/, "Please enter a correct formatted email."] },
    password: { type: String, required: true, trim: true, min: 8, max: 15 },
    articles: { type: mongoose.Schema.Types.ObjectId, ref: "Article" }
});

module.exports = mongoose.model("User", userSchema);
