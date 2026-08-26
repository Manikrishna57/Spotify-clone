// ========================================
// AUTH MODAL
// ========================================

const authModal = document.getElementById("authModal");
const userIcon = document.getElementById("userIcon");
const closeAuth = document.getElementById("closeAuth");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const likeBtn = document.getElementById("likeBtn");


// ========================================
// PLAYLIST MODAL
// ========================================

const playlistModal =
    document.getElementById("playlistModal");

const closePlaylistModal =
    document.getElementById("closePlaylistModal");

const playlistSelectionList =
    document.getElementById("playlistSelectionList");

let selectedSong = null;

// ========================================
// OPEN LOGIN MODAL
// ========================================

userIcon.addEventListener("click", () => {
    authModal.style.display = "flex";
});


// ========================================
// CLOSE MODAL
// ========================================

closeAuth.addEventListener("click", () => {
    authModal.style.display = "none";
});


// ========================================
// SHOW REGISTER
// ========================================

showRegister.addEventListener("click", () => {

    loginSection.style.display = "none";
    registerSection.style.display = "block";

});


// ========================================
// SHOW LOGIN
// ========================================

showLogin.addEventListener("click", () => {

    registerSection.style.display = "none";
    loginSection.style.display = "block";

});
// ========================================
// REGISTER USER
// ========================================

const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            authMessage.textContent = data.message || "Registration failed";
            return;
        }

        authMessage.textContent = "Account created successfully!";

        console.log("Registered user:", data.user);

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Clear form
        registerForm.reset();

        // Switch to login after 1.5 seconds
        setTimeout(() => {

            registerSection.style.display = "none";
            loginSection.style.display = "block";

            authMessage.textContent = "";

        }, 1500);

    } catch (error) {

        console.error("Registration error:", error);

        authMessage.textContent =
            "Cannot connect to server. Make sure backend is running.";

    }

});
// ========================================
// LOGIN USER
// ========================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            authMessage.textContent =
                data.message || "Login failed";

            return;
        }

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save user information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        authMessage.textContent = "Login successful!";

        console.log("Logged in user:", data.user);

        // Clear form
        loginForm.reset();

        // Close modal after login
        setTimeout(() => {

            authModal.style.display = "none";
            authMessage.textContent = "";

        }, 1000);

    } catch (error) {

        console.error("Login error:", error);

        authMessage.textContent =
            "Cannot connect to server.";

    }

});
// ========================================
// DISPLAY LOGGED-IN USER
// ========================================

const welcomeUser = document.getElementById("welcomeUser");

const savedUser = localStorage.getItem("user");

if (savedUser) {

    const user = JSON.parse(savedUser);

    welcomeUser.textContent = `Hi, ${user.name}`;

}

// ========================================
// LOGOUT
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Remove username
    welcomeUser.textContent = "";

    alert("Logged out successfully!");

    // Optional: open login popup
    authModal.style.display = "flex";

});
// ========================================
// LOAD USER PLAYLISTS
// ========================================

async function loadPlaylists() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/playlists",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        console.log("PLAYLIST DATA:", data.playlists);
        displayPlaylists(data.playlists);
        

    } catch (error) {

        console.error("Error loading playlists:", error);

    }
}



// ========================================
// DISPLAY PLAYLISTS IN LIBRARY
// ========================================

function displayPlaylists(playlists) {

    const container =
        document.getElementById("dynamicPlaylists");

    if (!container) {
        console.error("dynamicPlaylists NOT FOUND");
        return;
    }

    console.log("Displaying playlists:", playlists);

    // Clear old playlists
    container.innerHTML = "";

    if (!playlists || playlists.length === 0) {

        console.log("No playlists found");

        return;
    }

    playlists.forEach(playlist => {

        const playlistElement =
            document.createElement("div");

        playlistElement.className = "playlist-item";

        playlistElement.innerHTML = `
            <div class="playlist-item-info">
                <i class="fa-solid fa-music"></i>
                <span>${playlist.name}</span>
            </div>

            <button
                class="delete-playlist-btn"
                title="Delete playlist">
                🗑
            </button>
        `;

        // ========================================
        // OPEN PLAYLIST
        // ========================================

        const playlistInfo =
            playlistElement.querySelector(".playlist-item-info");

        playlistInfo.addEventListener("click", () => {

            console.log(
                "Opening playlist:",
                playlist.name
            );

            openPlaylist(playlist);

        });

        // ========================================
        // DELETE PLAYLIST
        // ========================================

        const deleteBtn =
            playlistElement.querySelector(
                ".delete-playlist-btn"
            );

        deleteBtn.addEventListener("click", async (event) => {

            event.stopPropagation();

            const confirmDelete = confirm(
                `Are you sure you want to delete "${playlist.name}"?`
            );

            if (!confirmDelete) {
                return;
            }

            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Please login again.");
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:5000/api/playlists/${playlist._id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();

                console.log(
                    "DELETE PLAYLIST RESPONSE:",
                    data
                );

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to delete playlist"
                    );

                    return;
                }

                alert(
                    "✅ Playlist deleted successfully"
                );

                // Reload library
                await loadPlaylists();

            } catch (error) {

                console.error(
                    "Delete playlist error:",
                    error
                );

                alert(
                    "Failed to delete playlist"
                );
            }

        });

        container.appendChild(playlistElement);

    });

}
// Load playlists when page opens
loadPlaylists();
// ========================================
// CREATE PLAYLIST FROM FRONTEND
// ========================================

const createPlaylistBtn =
    document.getElementById("createPlaylistBtn");

createPlaylistBtn.addEventListener("click", async () => {

    // Check if user is logged in
    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        authModal.style.display = "flex";

        return;
    }


    // Ask for playlist name
    const playlistName =
        prompt("Enter playlist name:");


    // User clicked Cancel
    if (playlistName === null) {
        return;
    }


    // Empty name
    if (playlistName.trim() === "") {

        alert("Please enter a playlist name.");

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:5000/api/playlists",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name: playlistName.trim(),
                    description: ""
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message || "Failed to create playlist"
            );

            return;
        }


        // Success
        alert("Playlist created successfully!");


        // Reload playlists from MongoDB
        loadPlaylists();


    } catch (error) {

        console.error(
            "Create playlist error:",
            error
        );

        alert(
            "Cannot connect to the server."
        );

    }

});

// ========================================
// LOAD SONGS FROM BACKEND
// ========================================

async function loadSongs() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/songs"
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        songsList = data.songs;
        displaySongs(songsList);

    } catch (error) {

        console.error("Error loading songs:", error);

    }

}


// ========================================
// DISPLAY SONGS
// ========================================

function displaySongs(songs) {

    const songsContainer =
        document.getElementById("songsContainer");

    if (!songsContainer) {
        return;
    }

    // Clear existing cards
    songsContainer.innerHTML = "";


    songs.slice(0, 1).forEach(song => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <img
                    src="./${song.coverImage}"
                    class="card-img"
                    alt="${song.title}"
                >

                <p class="card-title">
                    ${song.title}
                </p>

                <p class="card-info">
                    ${song.artist}
                </p>
            `;

            songsContainer.appendChild(card);

        });

}


// Load songs when page opens
loadSongs();

// ========================================
// MUSIC PLAYER
// ========================================

const audioPlayer = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const rewindBtn = document.getElementById("rewindBtn");
const forwardBtn = document.getElementById("forwardBtn");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const volumeBar = document.getElementById("volumeBar");

let currentSongIndex = 0;
let currentSong = null;
let songsList = [];
let isShuffleOn = false;
let repeatMode = 0;


const currentUser = JSON.parse(
    localStorage.getItem("user")
);

const recentlyPlayedKey = currentUser
    ? `recentlyPlayed_${currentUser.id}`
    : "recentlyPlayed_guest";

let recentlyPlayed = JSON.parse(
    localStorage.getItem(recentlyPlayedKey) || "[]"
);

// ========================================
// PLAY SONG
// ========================================

function playSong(song) {

    if (!song) {
        return;
    }

    currentSong = song;

    addToRecentlyPlayed(song);

    updateLikeButton();

    // Set current song index
    const index = songsList.findIndex(
        s => s._id === song._id
    );

    if (index !== -1) {
        currentSongIndex = index;
    }

    // Set audio source
    audioPlayer.src = song.audioUrl;

    // Load the new song
    audioPlayer.load();

    // Update queue highlight
    updateQueueHighlight();

    // Update queue if it is currently open
    if (
        queuePanel &&
        queuePanel.classList.contains("open")
    ) {
        renderQueue();
    }

    // Play song
    audioPlayer.play().catch(error => {
        console.error("❌ Playback error:", error);
    });
}

async function updateLikeButton() {

    if (!likeBtn) {
        return;
    }

    if (!currentSong) {
        likeBtn.textContent = "♡";
        likeBtn.classList.remove("active");
        return;
    }

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {

        likeBtn.textContent = "♡";
        likeBtn.classList.remove("active");

        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/likes/${currentSong._id}?userId=${user.id}`
            );

        const data =
            await response.json();

        if (data.liked) {

            likeBtn.textContent = "♥";
            likeBtn.classList.add("active");

        } else {

            likeBtn.textContent = "♡";
            likeBtn.classList.remove("active");

        }

    } catch (error) {

        console.error(
            "❌ Failed to load like status:",
            error
        );

    }

}

playBtn.addEventListener("click", () => {

    if (!audioPlayer.src) {
        if (songsList.length > 0) {
            playSong(songsList[currentSongIndex]);
        }
        return;
    }

    if (audioPlayer.paused) {

        audioPlayer.play();

    } else {

        audioPlayer.pause();

    }

});

audioPlayer.addEventListener("play", () => {
    // Playback started
});

audioPlayer.addEventListener("pause", () => {
    // Playback paused
});

audioPlayer.addEventListener("loadedmetadata", () => {

    progressBar.max = audioPlayer.duration;

    totalTime.textContent =
        formatTime(audioPlayer.duration);

});

audioPlayer.addEventListener("timeupdate", () => {

    progressBar.value =
        audioPlayer.currentTime;

    currentTime.textContent =
        formatTime(audioPlayer.currentTime);

});

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

progressBar.addEventListener("input", () => {

    audioPlayer.currentTime =
        progressBar.value;

});

volumeBar.addEventListener("input", () => {

    audioPlayer.volume = volumeBar.value;

});

nextBtn.addEventListener("click", () => {

    if (songsList.length === 0) {
        return;
    }

    currentSongIndex++;

    if (currentSongIndex >= songsList.length) {
        currentSongIndex = 0;
    }

    playSong(songsList[currentSongIndex]);

});

previousBtn.addEventListener("click", () => {

    if (songsList.length === 0) {
        return;
    }

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = songsList.length - 1;
    }

    playSong(songsList[currentSongIndex]);

});
rewindBtn.addEventListener("click", () => {

    audioPlayer.currentTime =
        Math.max(0, audioPlayer.currentTime - 10);

});
forwardBtn.addEventListener("click", () => {

    audioPlayer.currentTime =
        Math.min(
            audioPlayer.duration,
            audioPlayer.currentTime + 10
        );

});
audioPlayer.addEventListener("ended", () => {

    if (songsList.length === 0) {
        return;
    }

    // ========================================
    // REPEAT ONE
    // ========================================

    if (repeatMode === 2) {

    playSong(songsList[currentSongIndex]);

    return;
    }


    // ========================================
    // REPEAT ALL / NORMAL PLAYBACK
    // ========================================

    currentSongIndex++;

 // Reached end of playlist
if (currentSongIndex >= songsList.length) {

    // REPEAT ALL
    if (repeatMode === 1) {

        currentSongIndex = 0;

        playSong(songsList[currentSongIndex]);

    }

    // REPEAT OFF
    else {

        currentSongIndex = songsList.length - 1;

        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }

    return;
}
    // Play next song
    playSong(songsList[currentSongIndex]);

});

// ========================================
// REPEAT BUTTON
// ========================================

const repeatBtn = document.getElementById("repeatBtn");

repeatBtn.addEventListener("click", () => {

    repeatMode++;

    if (repeatMode > 2) {
        repeatMode = 0;
    }

    // REPEAT OFF
   if (repeatMode === 0) {

    repeatBtn.textContent = "↻";
    repeatBtn.title = "Repeat OFF";
    repeatBtn.classList.remove("active");
    repeatBtn.classList.remove("repeat-one");
}

// REPEAT ALL
else if (repeatMode === 1) {

    repeatBtn.textContent = "↻";
    repeatBtn.title = "Repeat ALL";
    repeatBtn.classList.add("active");
    repeatBtn.classList.remove("repeat-one");
}

// REPEAT ONE
else if (repeatMode === 2) {

    repeatBtn.textContent = "↻";
    repeatBtn.title = "Repeat ONE";
    repeatBtn.classList.add("active");
    repeatBtn.classList.add("repeat-one");
}
});
// ========================================
// LOAD USER PLAYLISTS
// ========================================

async function loadPlaylists() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.log("User not logged in");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/playlists",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        displayPlaylists(data.playlists);

    } catch (error) {

        console.error("Error loading playlists:", error);

    }
}


// ========================================
// DISPLAY PLAYLISTS
// ========================================

function displayPlaylists(playlists) {

    const container =
        document.getElementById("dynamicPlaylists");

    if (!container) {
        console.error("dynamicPlaylists NOT FOUND");
        return;
    }

    console.log("Displaying playlists:", playlists);

    // Clear existing playlists
    container.innerHTML = "";


    // ========================================
    // ❤️ LIKED SONGS
    // ========================================

    const likedSongsElement =
        document.createElement("div");

    likedSongsElement.className =
        "playlist-item liked-songs-item";

    likedSongsElement.innerHTML = `
    <div class="playlist-item-info">

        <div class="liked-songs-icon">
            ♥
        </div>

        <div class="liked-songs-text">

            <span class="liked-songs-title">
                Liked Songs
            </span>

            <span
                class="liked-songs-count"
                id="likedSongsCount">
                Loading...
            </span>

        </div>

    </div>
`;


    // Open Liked Songs
    const likedSongsInfo =
        likedSongsElement.querySelector(
            ".playlist-item-info"
        );

    likedSongsInfo.addEventListener("click", () => {

    openLikedSongs();

   });


    container.appendChild(
        likedSongsElement
    );

    async function updateLikedSongsCount() {

    const countElement =
        document.getElementById("likedSongsCount");

    if (!countElement) {
        return;
    }

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        countElement.textContent = "0 songs";
        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/likes?userId=${user.id}`
            );

        const data =
            await response.json();

        if (!response.ok) {
            countElement.textContent = "0 songs";
            return;
        }

        const count =
            data.likedSongs
                ? data.likedSongs.length
                : 0;

        countElement.textContent =
            `${count} ${count === 1 ? "song" : "songs"}`;

    } catch (error) {

        console.error(
            "❌ Failed to load liked songs count:",
            error
        );

        countElement.textContent = "0 songs";
    }
}


    // ========================================
    // 🎵 NORMAL PLAYLISTS
    // ========================================

    if (!playlists || playlists.length === 0) {

        console.log(
            "No playlists found"
        );

        return;
    }


    playlists.forEach(playlist => {

        const playlistElement =
            document.createElement("div");

        playlistElement.className =
            "playlist-item";

        playlistElement.innerHTML = `
            <div class="playlist-item-info">

                <i class="fa-solid fa-music"></i>

                <span>
                    ${playlist.name}
                </span>

            </div>

            <button
                class="delete-playlist-btn"
                title="Delete playlist">
                🗑
            </button>
        `;


        // ========================================
        // OPEN PLAYLIST
        // ========================================

        const playlistInfo =
            playlistElement.querySelector(
                ".playlist-item-info"
            );

        playlistInfo.addEventListener(
            "click",
            () => {

                console.log(
                    "Opening playlist:",
                    playlist.name
                );

                openPlaylist(playlist);

            }
        );


        // ========================================
        // DELETE PLAYLIST
        // ========================================

        const deleteBtn =
            playlistElement.querySelector(
                ".delete-playlist-btn"
            );

        deleteBtn.addEventListener(
            "click",
            async (event) => {

                event.stopPropagation();

                const confirmDelete =
                    confirm(
                        `Are you sure you want to delete "${playlist.name}"?`
                    );

                if (!confirmDelete) {
                    return;
                }


                const token =
                    localStorage.getItem("token");

                if (!token) {

                    alert(
                        "Please login again."
                    );

                    return;
                }


                try {

                    const response =
                        await fetch(
                            `http://localhost:5000/api/playlists/${playlist._id}`,
                            {
                                method: "DELETE",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "DELETE PLAYLIST RESPONSE:",
                        data
                    );


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Failed to delete playlist"
                        );

                        return;
                    }


                    alert(
                        "✅ Playlist deleted successfully"
                    );


                    await loadPlaylists();


                } catch (error) {

                    console.error(
                        "Delete playlist error:",
                        error
                    );


                    alert(
                        "Failed to delete playlist"
                    );

                }

            }
        );


        container.appendChild(
            playlistElement
        );
        updateLikedSongsCount();

    });

}

async function openLikedSongs() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {

        alert("Please login to view liked songs.");

        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/likes?userId=${user.id}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            console.error(
                "❌ Failed to load liked songs:",
                data
            );

            return;
        }

        // Store liked songs
        songsList =
            data.likedSongs || [];

        currentSongIndex = 0;

        // Show playlist-style page
        openPlaylist({
            _id: "liked-songs",
            name: "Liked Songs",
            description: "Your favorite songs",
            songs: songsList
        });

        const playlistHeader =
            document.querySelector(".playlist-header");

        if (playlistHeader) {

            playlistHeader.classList.add(
                "liked-songs-header"
            );

        }

    } catch (error) {

        console.error(
            "❌ Error loading liked songs:",
            error
        );

    }

}


// ========================================
// OPEN PLAYLIST
// ========================================

function openPlaylist(playlist) {

    window.currentPlaylist = playlist;

    isShuffleOn = false;
    songsList = [...playlist.songs];
    currentSongIndex = 0;

    

    console.log("Opened playlist:", playlist.name);

    const container =
        document.getElementById("playlistSongsContainer");

    if (!container) {
        console.error("playlistSongsContainer NOT FOUND");
        return;
    }

    // Hide Home
    const homeContent =
        document.getElementById("homeContent");

    if (homeContent) {
        homeContent.style.display = "none";
    }

    // Show Playlist
    container.style.display = "block";


    // ========================================
// DYNAMIC PLAYLIST COVER
// ========================================

let playlistCover = "./assets/card1img.jpeg";

if (
    playlist.songs &&
    playlist.songs.length > 0 &&
    playlist.songs[0].coverImage
) {
    playlistCover = "./" + playlist.songs[0].coverImage;
}



    // Playlist header
container.innerHTML = `
    <div class="playlist-header">

        <img
            class="playlist-cover"
            src="./${playlist.songs?.[0]?.coverImage || "assets/card1img.jpeg"}"
            alt="${playlist.name}"
        >

        <div class="playlist-header-info">

            <p>
                ${playlist._id === "liked-songs"
                    ? "YOUR LIBRARY"
                    : "PLAYLIST"}
            </p>

            <h2>${playlist.name}</h2>

            <p>
                ${playlist._id === "liked-songs"
                    ? `${playlist.songs?.length || 0} liked song(s)`
                    : `${playlist.songs?.length || 0} song(s)`}
            </p>

        </div>

        <div class="playlist-header-actions">

            <button class="play-all-btn">
                ▶ Play All
            </button>

            <button class="shuffle-playlist-btn">
                🔀 Shuffle
            </button>

            ${
                playlist._id !== "liked-songs"
                    ? `
                        <button class="edit-playlist-btn">
                            ✏️ Edit
                        </button>

                        <button class="delete-playlist-btn">
                            🗑 Delete
                        </button>
                    `
                    : ""
            }

        </div>

    </div>
`;


// ========================================
// DELETE OPENED PLAYLIST
// ========================================

const openedPlaylistDeleteBtn =
    container.querySelector(".delete-playlist-btn");

if (openedPlaylistDeleteBtn) {

    openedPlaylistDeleteBtn.addEventListener(
        "click",
        async (event) => {

            event.stopPropagation();

            const confirmDelete = confirm(
                `Are you sure you want to delete "${playlist.name}"?`
            );

            if (!confirmDelete) {
                return;
            }

            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Please login again.");
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:5000/api/playlists/${playlist._id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();

            
                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to delete playlist"
                    );

                    return;
                }

                alert(
                    "✅ Playlist deleted successfully!"
                );

                // Clear opened playlist
                container.innerHTML = "";

                // Hide playlist page
                container.style.display = "none";

                // Show Home
                if (homeContent) {
                    homeContent.style.display = "block";
                }

                // Refresh Library
                await loadPlaylists();

            } catch (error) {

                console.error(
                    "Delete playlist error:",
                    error
                );

                alert(
                    "Failed to delete playlist"
                );

            }

        }
    );

}


if (playlist._id === "liked-songs") {

    const header =
        container.querySelector(".playlist-header");

    if (header) {
        header.classList.add(
            "liked-songs-header"
        );
    }

}

// ========================================
// PLAY ALL PLAYLIST SONGS
// ========================================

const playAllBtn =
    container.querySelector(".play-all-btn");

if (playAllBtn) {

    playAllBtn.addEventListener("click", () => {

        if (!playlist.songs || playlist.songs.length === 0) {

            alert("This playlist is empty.");
            return;

        }

        // Use this playlist for the player
        songsList = [...playlist.songs];

        // Start from first song
        currentSongIndex = 0;

        // Play first song
        playSong(songsList[currentSongIndex]);

    });

}

// ========================================
// SHUFFLE TOGGLE
// ========================================

const shuffleBtn =
    container.querySelector(".shuffle-playlist-btn");

if (shuffleBtn) {

    shuffleBtn.addEventListener("click", () => {

        if (!playlist.songs || playlist.songs.length === 0) {
            alert("This playlist is empty.");
            return;
        }

        // SHUFFLE ON
       if (!isShuffleOn) {

    isShuffleOn = true;

    songsList = [...playlist.songs];

    // Fisher-Yates shuffle
    for (let i = songsList.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [songsList[i], songsList[j]] =
            [songsList[j], songsList[i]];
    }

    currentSongIndex = 0;

    shuffleBtn.classList.add("active");

    playSong(songsList[currentSongIndex]);

}

// SHUFFLE OFF
else {

    isShuffleOn = false;

    songsList = [...playlist.songs];

    if (currentSong) {

        const index =
            songsList.findIndex(
                song => song._id === currentSong._id
            );

        currentSongIndex =
            index >= 0 ? index : 0;

    } else {

        currentSongIndex = 0;

    }

    shuffleBtn.classList.remove("active");
}

    });

}
// ========================================
// EDIT PLAYLIST BUTTON
// ========================================

const editPlaylistBtn =
    container.querySelector(".edit-playlist-btn");

if (editPlaylistBtn) {

    editPlaylistBtn.addEventListener("click", async () => {

        const newName = prompt(
            "Enter new playlist name:",
            playlist.name
        );

        if (newName === null) {
            return;
        }

        const trimmedName = newName.trim();

        if (trimmedName === "") {
            alert("Playlist name cannot be empty.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/playlists/${playlist._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name: trimmedName
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update playlist"
                );

                return;
            }

            alert("✅ Playlist renamed successfully");

            // Open updated playlist again
            openPlaylist(data.playlist);

            // Refresh Library
            loadPlaylists();

        } catch (error) {

            console.error(
                "UPDATE PLAYLIST ERROR:",
                error
            );

            alert("Failed to rename playlist");
        }

    });

}

// Empty playlist
if (!playlist.songs || playlist.songs.length === 0) {

    const emptyMessage = document.createElement("p");

    emptyMessage.textContent = "This playlist is empty.";

    container.appendChild(emptyMessage);

    return;
}

    // Display songs
   playlist.songs.forEach(song => {

    const songElement = document.createElement("div");

    songElement.className = "playlist-song";

    songElement.innerHTML = `
    <span class="playlist-song-number">
        ${playlist.songs.indexOf(song) + 1}
    </span>

    <img
        src="./${song.coverImage}"
        width="60"
        height="60"
        alt="${song.title}"
    >

    <div class="playlist-song-info">

        <p class="playlist-song-title">
            ${song.title}
        </p>

        <p class="playlist-song-artist">
            ${song.artist}
        </p>

    </div>

    <p class="playlist-song-album">
        ${song.album}
    </p>

    <div class="playlist-song-actions">

        <button
            class="playlist-play-btn"
            title="Play">
            ▶
        </button>

        <button
            class="playlist-remove-btn"
            title="Remove from playlist">
            🗑
        </button>

    </div>
`;


    // PLAY SONG
    const playButton =
        songElement.querySelector(".playlist-play-btn");

    playButton.addEventListener("click", () => {
        playSong(song);
    });


    // REMOVE SONG
    const removeButton =
        songElement.querySelector(".playlist-remove-btn");

    removeButton.addEventListener("click", async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            return;
        }

        const confirmRemove =
            confirm(`Remove "${song.title}" from ${playlist.name}?`);

        if (!confirmRemove) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/playlists/${playlist._id}/songs/${song._id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to remove song");
                return;
            }

            alert("✅ Song removed from playlist");

            // Reload playlists
            const updatedResponse = await fetch(
                "http://localhost:5000/api/playlists",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedData =
                await updatedResponse.json();

            const updatedPlaylist =
                updatedData.playlists.find(
                    p => p._id === playlist._id
                );

            if (updatedPlaylist) {
                openPlaylist(updatedPlaylist);
            }

            // Refresh library
            loadPlaylists();

        } catch (error) {

            console.error(
                "Remove song error:",
                error
            );

            alert("Failed to remove song");

        }

    });


    

container.appendChild(songElement);
});
}



// ========================================
// OPEN ADD TO PLAYLIST MODAL
// ========================================

function openAddToPlaylistModal(song) {

    showPlaylistSelector(song);
}

async function showPlaylistSelector(song) {

    const modal = document.getElementById("playlistModal");
    const playlistList =
        document.getElementById("playlistSelectionList");

    if (!modal || !playlistList) {
        console.error("Playlist modal elements not found");
        return;
    }

    modal.style.display = "flex";

    playlistList.innerHTML = `
        <p>Loading playlists...</p>
    `;

    const token = localStorage.getItem("token");

    if (!token) {
        playlistList.innerHTML = `
            <p>Please login first.</p>
        `;
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/playlists",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log("Playlist API response:", data);

        if (!response.ok) {
            playlistList.innerHTML = `
                <p>${data.message || "Failed to load playlists"}</p>
            `;
            return;
        }

        const playlists = data.playlists || [];

        if (playlists.length === 0) {
            playlistList.innerHTML = `
                <p>No playlists found.</p>
            `;
            return;
        }

        playlistList.innerHTML = "";

        playlists.forEach(playlist => {

            const playlistButton =
                document.createElement("button");

            playlistButton.className =
                "playlist-selection-item";

            playlistButton.textContent =
                playlist.name;

            playlistButton.addEventListener(
                "click",
                async () => {

                    const token = localStorage.getItem("token");

                        await addSongToPlaylist(
                            playlist._id,
                            song._id,
                            token
                        );

                    
                }
            );

            playlistList.appendChild(
                playlistButton
            );

        });

    } catch (error) {

        console.error(
            "Error loading playlists:",
            error
        );

        playlistList.innerHTML = `
            <p>Error loading playlists.</p>
        `;
    }
}
// Close modal using X
closePlaylistModal.addEventListener("click", () => {

    playlistModal.style.display = "none";

});
// Close when clicking outside modal
playlistModal.addEventListener("click", (event) => {

    if (event.target === playlistModal) {
        playlistModal.style.display = "none";
    }

});

async function addSongToPlaylist(
    playlistId,
    songId,
    token
) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/playlists/${playlistId}/songs/${songId}`,
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

         if (data.message === "Song already exists in playlist") {
            alert("⚠ This song is already in the selected playlist.");
            } else {
              alert(data.message || "Failed to add song");
            }

            return;
        }

        alert("✅ Song added successfully!");

        playlistModal.style.display = "none";

        // Reload playlists
        loadPlaylists();

        // Reload currently opened playlist
        const updatedPlaylists = await fetch(
            "http://localhost:5000/api/playlists",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const updatedData = await updatedPlaylists.json();

        const playlist = updatedData.playlists.find(
            p => p._id === playlistId
        );

        if (playlist) {
            openPlaylist(playlist);
        }

        console.log(data);

    } catch (error) {

        console.error("Add song error:", error);
        alert("Failed to add song to playlist");

    }
}


async function removeSongFromPlaylist(
    playlistId,
    songId,
    token
) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/playlists/${playlistId}/songs/${songId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to remove song from playlist"
            );

            return;
        }

        alert("✅ Song removed from playlist successfully");

        // Reload playlists
        await loadPlaylists();

        // Reload current playlist
        const updatedResponse = await fetch(
            "http://localhost:5000/api/playlists",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const updatedData =
            await updatedResponse.json();

        const updatedPlaylist =
            updatedData.playlists.find(
                p => p._id === playlistId
            );

        if (updatedPlaylist) {
            openPlaylist(updatedPlaylist);
        }

    } catch (error) {

        console.error(
            "Remove song error:",
            error
        );

        alert(
            "Failed to remove song from playlist"
        );
    }
}
// ======================================
// SEARCH MODAL
// ======================================

const searchNav =
    document.getElementById("searchNav");

const searchModal =
    document.getElementById("searchModal");

const closeSearchModal =
    document.getElementById("closeSearchModal");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");

searchNav.addEventListener("click", () => {

    searchModal.style.display = "flex";

    searchInput.focus();

});

closeSearchModal.addEventListener("click", () => {

    searchModal.style.display = "none";

    searchInput.value = "";
    searchResults.innerHTML = "";

});

searchModal.addEventListener("click", (e) => {

    if (e.target === searchModal) {

        searchModal.style.display = "none";

        searchInput.value = "";
        searchResults.innerHTML = "";
    }

});

// ======================================
// LIVE SEARCH
// ======================================

searchInput.addEventListener("input", async () => {

    const query = searchInput.value.trim();

    // Clear results if search is empty
    if (!query) {
        searchResults.innerHTML = "";
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok) {
            searchResults.innerHTML =
                "<p>Search failed.</p>";
            return;
        }

        displaySearchResults(data.songs);

    } catch (error) {

        console.error("Search error:", error);

        searchResults.innerHTML =
            "<p>Unable to search songs.</p>";

    }

});

// ======================================
// DISPLAY SEARCH RESULTS
// ======================================

function displaySearchResults(songs) {

    searchResults.innerHTML = "";

    if (!songs || songs.length === 0) {

        searchResults.innerHTML = `
            <p style="color:white;">
                No songs found.
            </p>
        `;

        return;
    }

    songs.forEach(song => {

        const result = document.createElement("div");

        result.className = "search-result";

        result.innerHTML = `
            <img
                src="./${song.coverImage}"
                alt="${song.title}"
            >

            <div class="search-song-info">

                <p class="search-song-title">
                    ${song.title}
                </p>

                <p class="search-song-artist">
                    ${song.artist}
                </p>

            </div>

            <div class="search-result-actions">

                <button class="search-play-btn">
                    ▶
                </button>

                <button
                    class="search-add-btn"
                    title="Add to playlist">
                    +
                </button>

            </div>
        `;

        // ==========================
        // SEARCH PLAY BUTTON
        // ==========================

        const playButton =
            result.querySelector(".search-play-btn");

        playButton.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();

            playSong(song);

        });

        // ==========================
        // SEARCH ADD BUTTON
        // ==========================

        const addBtn =
            result.querySelector(".search-add-btn");

        addBtn.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();

            const searchModal =
                document.getElementById("searchModal");

            if (searchModal) {
                searchModal.style.display = "none";
            }

            openAddToPlaylistModal(song);

        });

        searchResults.appendChild(result);

    });

}

// ========================================
// LOAD HOME PAGE SONGS
// ========================================

async function loadHomeSongs() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/songs"
        );

        const data = await response.json();

        console.log("Home songs API response:", data);

        if (!response.ok) {
            console.error(
                "Songs API error:",
                data.message
            );
            return;
        }

        displayHomeSongs(data.songs);

    } catch (error) {

        console.error(
            "Error loading home songs:",
            error
        );

    }
}
// ========================================
// DISPLAY HOME SONGS
// ========================================

function displayHomeSongs(songs) {

    const recentContainer =
        document.getElementById("recentSongsContainer");

    const trendingContainer =
        document.getElementById("trendingSongsContainer");

    const featuredContainer =
        document.getElementById("featuredSongsContainer");


    if (!recentContainer ||
        !trendingContainer ||
        !featuredContainer) {

        console.log("recentContainer:", recentContainer);
        console.log("trendingContainer:", trendingContainer);
        console.log("featuredContainer:", featuredContainer);

        return;
    }


    if (!songs || songs.length === 0) {

        recentContainer.innerHTML =
            "<p>No songs available.</p>";

        trendingContainer.innerHTML =
            "<p>No songs available.</p>";

        featuredContainer.innerHTML =
            "<p>No songs available.</p>";

        return;
    }


    


    // Recently played
renderRecentlyPlayed();


    // Trending
    trendingContainer.innerHTML = "";

    songs.forEach(song => {

        trendingContainer.appendChild(
            createCard(song)
        );

    });


    // Featured
    featuredContainer.innerHTML = "";

    songs.forEach(song => {

        featuredContainer.appendChild(
            createCard(song)
        );

    });

}
document.addEventListener("DOMContentLoaded", () => {

    loadPlaylists();
    loadHomeSongs();

});
const libraryBtn = document.getElementById("libraryBtn");

if (libraryBtn) {

    libraryBtn.addEventListener("click", () => {

        console.log("Library clicked");

        const homeSection =
            document.getElementById("homeSection");

        const librarySection =
            document.getElementById("librarySection");

        if (homeSection) {
            homeSection.style.display = "none";
        }

        if (librarySection) {
            librarySection.style.display = "block";
        }

        loadPlaylists();
    });
}

const homeBtn =
    document.getElementById("homeBtn");

if (homeBtn) {

    homeBtn.addEventListener("click", () => {

        const homeContent =
            document.getElementById("homeContent");

        const playlistSongsContainer =
            document.getElementById("playlistSongsContainer");

        if (homeContent) {
            homeContent.style.display = "block";
        }

        if (playlistSongsContainer) {
            playlistSongsContainer.style.display = "none";
        }

    });

}

// ========================================
// CREATE SONG CARD
// ========================================

const createCard = (song) => {

    const card =
        document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <img
            src="./${song.coverImage}"
            class="card-img"
            alt="${song.title}"
        >

        <p class="card-title">
            ${song.title}
        </p>

        <p class="card-info">
            ${song.artist} • ${song.album}
        </p>

        <div class="song-card-actions">

            <button class="home-play-btn">
                ▶
            </button>

            <button
                class="add-song-btn"
                title="Add to playlist">
                +
            </button>

        </div>
    `;

    const playButton =
        card.querySelector(".home-play-btn");

    playButton.addEventListener("click", () => {
        playSong(song);
    });

    const addSongButton =
        card.querySelector(".add-song-btn");

    addSongButton.addEventListener("click", () => {
        openAddToPlaylistModal(song);
    });

    return card;
};


// ========================================
// HOME BUTTON
// ========================================


if (homeBtn) {

    homeBtn.addEventListener("click", () => {

        const homeContent =
            document.getElementById("homeContent");

        const playlistSongsContainer =
            document.getElementById("playlistSongsContainer");

        if (homeContent) {
            homeContent.style.display = "block";
        }

        if (playlistSongsContainer) {
            playlistSongsContainer.style.display = "none";
            playlistSongsContainer.innerHTML = "";
        }

    });

}

// ========================================
// QUEUE PANEL
// ========================================

const queueBtn = document.getElementById("queueBtn");
const queuePanel = document.getElementById("queuePanel");
const closeQueueBtn = document.getElementById("closeQueueBtn");

// Open Queue
queueBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    renderQueue();

    queuePanel.classList.add("open");

});

// Close Queue
closeQueueBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    queuePanel.classList.remove("open");

});

// ========================================
// UPDATE QUEUE HIGHLIGHT
// ========================================

function updateQueueHighlight() {

    const queueList =
        document.getElementById("queueList");

    if (!queueList) {
        return;
    }

    const queueSongs =
        queueList.querySelectorAll(".queue-song");

    // Remove previous highlight
    queueSongs.forEach((songElement) => {

        songElement.classList.remove("current");

    });

    if (!currentSong) {
        return;
    }

    // Find current song
    queueSongs.forEach((songElement) => {

        const titleElement =
            songElement.querySelector(".queue-song-title");

        if (!titleElement) {
            return;
        }

        // Remove ▶ before comparing
        const title =
            titleElement.textContent
                .replace("▶", "")
                .trim();

        if (title === currentSong.title) {

            songElement.classList.add("current");

        }

    });


    // ========================================
    // AUTO-SCROLL CURRENT SONG INTO VIEW
    // ========================================

    const currentElement =
        queueList.querySelector(".queue-song.current");

    if (currentElement) {

        currentElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}

// ========================================
// DISPLAY QUEUE
// ========================================

function renderQueue() {

    const queueList =
        document.getElementById("queueList");

    if (!queueList) {
        return;
    }

    queueList.innerHTML = "";

    if (!songsList || songsList.length === 0) {

        queueList.innerHTML =
            `<p class="empty-queue">Queue is empty</p>`;

        return;
    }

    // ========================================
    // NOW PLAYING
    // ========================================

    const nowPlayingTitle =
        document.createElement("div");

    nowPlayingTitle.className =
        "queue-section-title";

    nowPlayingTitle.textContent =
        "Now Playing";

    queueList.appendChild(nowPlayingTitle);

    if (currentSong) {

        const currentElement =
            document.createElement("div");

        currentElement.className =
            "queue-song current";

        currentElement.innerHTML = `
            <img
                src="${currentSong.coverImage}"
                alt="${currentSong.title}">

            <div class="queue-song-info">

                <div class="queue-song-title">
                    ▶ ${currentSong.title}
                </div>

                <div class="queue-song-artist">
                    ${currentSong.artist}
                </div>

            </div>
        `;

        currentElement.addEventListener("click", () => {

            playSong(currentSong);

        });

        queueList.appendChild(currentElement);
    }

    // ========================================
    // UP NEXT
    // ========================================

    const upNextTitle =
        document.createElement("div");

    upNextTitle.className =
        "queue-section-title";

    upNextTitle.textContent =
        "Up Next";

    queueList.appendChild(upNextTitle);

    let upNextSongs = [];

    if (currentSong) {

        const currentIndex =
            songsList.findIndex(
                song => song._id === currentSong._id
            );

        if (currentIndex !== -1) {

            // Songs after current song
            upNextSongs =
                songsList.slice(currentIndex + 1);

            // Repeat ALL
            if (repeatMode === 1) {

                upNextSongs = [
                    ...upNextSongs,
                    ...songsList.slice(0, currentIndex)
                ];

            }

            // Shuffle
            else if (isShuffleOn) {

                upNextSongs = [
                    ...upNextSongs,
                    ...songsList.slice(0, currentIndex)
                ];

            }
        }
    }

    // ========================================
    // RENDER UP NEXT SONGS
    // ========================================

    upNextSongs.forEach(song => {

        const index =
            songsList.findIndex(
                s => s._id === song._id
            );

        const songElement =
            document.createElement("div");

        songElement.className =
            "queue-song";

        songElement.innerHTML = `
            <img
                src="${song.coverImage}"
                alt="${song.title}">

            <div class="queue-song-info">

                <div class="queue-song-title">
                    ${song.title}
                </div>

                <div class="queue-song-artist">
                    ${song.artist}
                </div>

            </div>
        `;

        songElement.addEventListener("click", () => {

            currentSongIndex = index;

            playSong(song);

        });

        queueList.appendChild(songElement);

    });

    // ========================================
    // EMPTY UP NEXT
    // ========================================

    if (upNextSongs.length === 0) {

        const emptyNext =
            document.createElement("p");

        emptyNext.className =
            "empty-queue";

        emptyNext.textContent =
            "No more songs";

        queueList.appendChild(emptyNext);

    }

}

// ========================================
// CLOSE QUEUE WHEN CLICKING OUTSIDE
// ========================================

// Close Queue when clicking outside
document.addEventListener("click", (event) => {

    if (
        queuePanel &&
        queuePanel.classList.contains("open") &&
        !queuePanel.contains(event.target) &&
        !queueBtn.contains(event.target)
    ) {

        queuePanel.classList.remove("open");
    }

});

// Close Queue with Escape key
document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        queuePanel &&
        queuePanel.classList.contains("open")
    ) {

        queuePanel.classList.remove("open");
    }

});

likeBtn.addEventListener("click", async () => {

    if (!currentSong) {
        return;
    }

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {

        alert("Please login to like songs.");

        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/likes/${currentSong._id}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: user.id
                    })
                }
            );


        const data =
            await response.json();


       if (!response.ok) {

    console.error(
        "❌ Like API error:",
        data
    );

    return;
}


// ========================================
// UPDATE UI
// ========================================

if (data.liked) {

    likeBtn.textContent = "♥";
    likeBtn.classList.add("active");

    currentSong.isLiked = true;

} else {

    likeBtn.textContent = "♡";
    likeBtn.classList.remove("active");

    currentSong.isLiked = false;


    // ========================================
    // REMOVE FROM LIKED SONGS PAGE
    // ========================================

    if (
        window.currentPlaylist &&
        window.currentPlaylist._id === "liked-songs"
    ) {

        songsList =
            songsList.filter(
                song =>
                    song._id !== currentSong._id
            );

        // Update the Liked Songs playlist
        if (window.currentPlaylist) {

            window.currentPlaylist.songs =
                [...songsList];

        }

        // Re-render the current playlist
        if (window.currentPlaylist) {

            openPlaylist(
                window.currentPlaylist
            );

        }
    }

}

} catch (error) {

    console.error(
        "❌ Like request failed:",
        error
    );

}

});

function addToRecentlyPlayed(song) {

    if (!song) {
        return;
    }

    // Remove duplicate if song was already played
    recentlyPlayed = recentlyPlayed.filter(
        s => s._id !== song._id
    );

    // Put latest song at the beginning
    recentlyPlayed.unshift(song);

    // Keep only the latest 10 songs
    recentlyPlayed = recentlyPlayed.slice(0, 10);

    // Save to localStorage
    localStorage.setItem(
        recentlyPlayedKey,
        JSON.stringify(recentlyPlayed)
    );

    renderRecentlyPlayed();
}

function renderRecentlyPlayed() {

    const recentContainer =
        document.getElementById("recentSongsContainer");

    if (!recentContainer) {
        return;
    }

    recentContainer.innerHTML = "";

    recentlyPlayed.forEach(song => {

        recentContainer.appendChild(
            createCard(song)
        );

    });
}