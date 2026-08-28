# 🎵 Spotify Clone — Full Stack Music Streaming Web App

A full-stack Spotify-inspired music streaming web application built using **HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB**.

The application provides music playback, user authentication, playlist management, liked songs, search, queue management, shuffle/repeat controls, and recently played songs.

---

## 🚀 Live Demo

### Frontend
https://spotify-clone-frontend-tgcr.onrender.com
### Backend API
https://spotify-clone-vgxl.onrender.com

---

## 📸 Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Protected playlist operations
- Persistent login using Local Storage

### 🎵 Music Player
- Play and pause songs
- Previous and next song
- Progress bar
- Seek through songs
- Display current song information
- Display song duration
- Audio playback controls

### 📚 Playlist Management
- Create playlists
- Open playlists
- Add songs to playlists
- Remove songs from playlists
- Rename playlists
- Delete playlists
- Playlist data persisted in MongoDB

### ❤️ Liked Songs
- Like songs
- Unlike songs
- Dedicated Liked Songs section
- Persistent liked songs
- Automatically update Liked Songs when a song is unliked

### 🔍 Search
- Search songs
- Display search results
- Play songs directly from search
- Add searched songs to playlists

### 🎵 Queue
- View currently playing song
- View upcoming songs
- Select songs from queue
- Close queue
- Automatically update queue when the current song changes

### 🔀 Shuffle
- Shuffle playlist songs
- Turn shuffle on/off
- Fisher-Yates shuffle algorithm

### 🔁 Repeat
Supports three repeat modes:

- Repeat OFF
- Repeat ALL
- Repeat ONE

### 🕘 Recently Played
- Automatically stores recently played songs
- Removes duplicate entries
- Shows latest played songs first
- Stores up to 10 recently played songs
- Persists recently played songs using Local Storage

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- HTML5 Audio API

### Backend
- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Deployment
- Render

### Development Tools
- Git
- GitHub
- Visual Studio Code

---

## 📂 Project Structure

```text
Spotify-clone/
│
├── assets/
│   ├── songs/
│   │   ├── song1.mp3
│   │   ├── song2.mp3
│   │   └── song3.mp3
│   │
│   ├── logo.png
│   ├── player_icon1.png
│   ├── player_icon2.png
│   └── ...
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Song.js
│   │   └── Playlist.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── songRoutes.js
│   │   ├── playlistRoutes.js
│   │   ├── likeRoutes.js
│   │   └── searchRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
