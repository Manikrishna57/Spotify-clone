const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const songRoutes = require("./routes/songRoutes");
const searchRoutes = require("./routes/searchRoutes");
const likeRoutes = require("./routes/likeRoutes");


const app = express();
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/likes", likeRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/search", searchRoutes);


// Test route
app.get("/", (req, res) => {
res.send("Spotify Clone Backend is Running!");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working!"
    });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
