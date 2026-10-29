const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   
        trim: true,
    },
    bio:{
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    followersCount: {
        type: Number,
        default: 0,
    },

    followingCount: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("User", userSchema);