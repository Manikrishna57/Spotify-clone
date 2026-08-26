const express = require("express");
const Song = require("../models/Song");

const router = express.Router();

// ======================================
// SEARCH SONGS
// ======================================

router.get("/", async (req, res) => {

    try {

        const query = req.query.q;

        if (!query) {

            return res.json({
                success: true,
                songs: []
            });

        }

        const songs = await Song.find({

            $or: [

                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },

                {
                    artist: {
                        $regex: query,
                        $options: "i"
                    }
                },

                {
                    album: {
                        $regex: query,
                        $options: "i"
                    }
                },

                {
                    genre: {
                        $regex: query,
                        $options: "i"
                    }
                }

            ]

        });

        res.json({

            success: true,
            songs

        });

    } catch (error) {

        console.error("Search error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

});

module.exports = router;