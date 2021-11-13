const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    uname: { type: String, require: true, trim: true, min: 2, unique: true },
    uemail: { type: String, required: true, trim: true, unique: true, match: [/(^[a-zA-Z]{1,})((\d){1,}|[\_|\.|\-][a-zA-Z]{1,})?\@([a-zA-Z]{1,})\-?([a-zA-Z]{1,})?\.([a-zA-Z]{2,3})$/, "Please enter a correct formatted email."] },
    upassword: { type: String, required: true, trim: true, min: 8, max: 15 },
    uarticles: { type: mongoose.Schema.Types.ObjectId, ref: "Article" }
});

module.exports = mongoose.model("User", userSchema);
