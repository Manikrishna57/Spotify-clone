const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        artist: {
            type: String,
            required: true,
            trim: true
        },

        album: {
            type: String,
            default: ""
        },

        coverImage: {
            type: String,
            default: ""
        },

        audioUrl: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            default: 0
        },

        genre: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Song", songSchema);