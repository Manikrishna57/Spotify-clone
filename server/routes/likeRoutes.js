const express = require("express");
const router = express.Router();

const User = require("../models/User");

// ========================================
// LIKE / UNLIKE SONG
// ========================================

router.post("/:songId", async (req, res) => {

    try {

        const { songId } = req.params;

        // Get user ID from request
        const userId = req.body.userId;

        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            });

        }

        const user =
            await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Check if song is already liked
        const alreadyLiked =
            user.likedSongs.some(
                id => id.toString() === songId
            );


        // ========================================
        // UNLIKE
        // ========================================

        if (alreadyLiked) {

            user.likedSongs =
                user.likedSongs.filter(
                    id => id.toString() !== songId
                );

            await user.save();

            return res.json({
                liked: false,
                message: "Song removed from liked songs"
            });

        }


        // ========================================
        // LIKE
        // ========================================

        user.likedSongs.push(songId);

        await user.save();

        res.json({
            liked: true,
            message: "Song added to liked songs"
        });

    } catch (error) {

        console.error(
            "Like API error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});

// ========================================
// CHECK IF SONG IS LIKED
// ========================================

router.get("/:songId", async (req, res) => {

    try {

        const { songId } = req.params;
        const { userId } = req.query;

        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            });

        }

        const user =
            await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const liked =
            user.likedSongs.some(
                id => id.toString() === songId
            );

        res.json({
            liked: liked
        });

    } catch (error) {

        console.error(
            "Check like API error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});

// ========================================
// GET ALL LIKED SONGS
// ========================================

router.get("/", async (req, res) => {

    try {

        const { userId } = req.query;

        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            });

        }

        const user =
            await User.findById(userId)
                .populate("likedSongs");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            likedSongs: user.likedSongs
        });

    } catch (error) {

        console.error(
            "Get liked songs error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;