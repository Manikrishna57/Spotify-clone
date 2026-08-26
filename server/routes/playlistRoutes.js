const express = require("express");

const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE PLAYLIST
// POST /api/playlists
// ========================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Playlist name is required"
            });
        }

        const playlist = await Playlist.create({
            name: name.trim(),
            description: description || "",
            owner: req.userId,
            songs: []
        });

        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        });

    } catch (error) {

        console.error("Create playlist error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ========================================
// GET USER PLAYLISTS
// GET /api/playlists
// ========================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const playlists = await Playlist.find({
            owner: req.userId
        }).populate("songs");

        res.json({
            success: true,
            playlists
        });

    } catch (error) {

        console.error("Get playlists error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// ========================================
// ADD SONG TO PLAYLIST
// POST /api/playlists/:playlistId/songs/:songId
// ========================================

router.post(
    "/:playlistId/songs/:songId",
    authMiddleware,
    async (req, res) => {

        try {

            const { playlistId, songId } = req.params;

            // Find playlist belonging to logged-in user
            const playlist = await Playlist.findOne({
                _id: playlistId,
                owner: req.userId
            });

            if (!playlist) {
                return res.status(404).json({
                    message: "Playlist not found"
                });
            }

            // Check whether song exists
            const song = await Song.findById(songId);

            if (!song) {
                return res.status(404).json({
                    message: "Song not found"
                });
            }

            // Prevent duplicate songs
            if (playlist.songs.includes(songId)) {
                return res.status(400).json({
                    message: "Song already exists in playlist"
                });
            }

            // Add song
            playlist.songs.push(songId);

            await playlist.save();

            res.json({
                success: true,
                message: "Song added to playlist successfully",
                playlist
            });

        } catch (error) {

            console.error("Add song to playlist error:", error);

            res.status(500).json({
                message: "Server error"
            });

        }
    }
);
module.exports = router;
// Remove song from playlist
router.delete("/:playlistId/songs/:songId", authMiddleware, async (req, res) => {

    try {

        const { playlistId, songId } = req.params;

        const playlist = await Playlist.findOneAndUpdate(
            {
                _id: playlistId,
                owner: req.userId
            },
            {
                $pull: {
                    songs: songId
                }
            },
            {
                new: true
            }
        );

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }

        res.json({
            success: true,
            message: "Song removed from playlist successfully",
            playlist
        });

    } catch (error) {

        console.error("Remove song error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to remove song"
        });

    }
});

// Delete playlist
router.delete("/:playlistId", authMiddleware, async (req, res) => {
    try {
        const { playlistId } = req.params;

        const playlist = await Playlist.findOneAndDelete({
            _id: playlistId,
            owner: req.userId
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }

        res.json({
            success: true,
            message: "Playlist deleted successfully"
        });

    } catch (error) {
        console.error("Delete playlist error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete playlist"
        });
    }
});

// ========================================
// UPDATE / RENAME PLAYLIST
// ========================================

router.put("/:playlistId", authMiddleware, async (req, res) => {

    try {

        const { playlistId } = req.params;
        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Playlist name is required"
            });
        }

        const playlist = await Playlist.findOneAndUpdate(
            {
                _id: playlistId,
                owner: req.userId
            },
            {
                name: name.trim(),
                description: description || ""
            },
            {
                new: true
            }
        );

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }

        res.json({
            success: true,
            message: "Playlist updated successfully",
            playlist
        });

    } catch (error) {

        console.error("Update playlist error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update playlist"
        });
    }
});