const express = require("express");
const router = express.Router();

const Song = require("../models/Song");
const authMiddleware = require("../middleware/authMiddleware");

// ========================================
// ADD SONG
// POST /api/songs
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            title,
            artist,
            album,
            coverImage,
            audioUrl,
            duration,
            genre
        } = req.body;

        if (!title || !artist || !audioUrl) {
            return res.status(400).json({
                message: "Title, artist and audioUrl are required"
            });
        }

        const song = await Song.create({
            title,
            artist,
            album: album || "",
            coverImage: coverImage || "",
            audioUrl,
            duration: duration || 0,
            genre: genre || ""
        });

        res.status(201).json({
            success: true,
            message: "Song added successfully",
            song
        });

    } catch (error) {

        console.error("Add song error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ========================================
// GET ALL SONGS
// GET /api/songs
// ========================================

router.get("/", async (req, res) => {

    try {

        const songs = await Song.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            songs
        });

    } catch (error) {

        console.error("Get songs error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ========================================
// UPDATE SONG
// PUT /api/songs/:songId
// ========================================

router.put("/:songId", authMiddleware, async (req, res) => {

    try {

        const { songId } = req.params;

        const {
            title,
            artist,
            album,
            coverImage,
            audioUrl
        } = req.body;

        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            });
        }

        if (title !== undefined) {
            song.title = title;
        }

        if (artist !== undefined) {
            song.artist = artist;
        }

        if (album !== undefined) {
            song.album = album;
        }

        if (coverImage !== undefined) {
            song.coverImage = coverImage;
        }

        if (audioUrl !== undefined) {
            song.audioUrl = audioUrl;
        }

        await song.save();

        res.json({
            success: true,
            message: "Song updated successfully",
            song
        });

    } catch (error) {

        console.error("Update song error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


module.exports = router;