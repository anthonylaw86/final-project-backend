const mongoose = require('mongoose');
const validator = require('validator');

const musicCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    artist: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    albumUrl: {
        type: String,
        required: true,
        validate: {
            validator: (v) => validator.isURL(v),
            message: "Link is not valid"
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("musicCards", musicCardSchema)