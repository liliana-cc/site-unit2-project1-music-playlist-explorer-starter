document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".playlist-cards");
    const modal = document.getElementById("music-modal");
    const closeBtn = modal.querySelector(".close");
    const modalArt = document.querySelector(".playlist-cover");
    const modalName = document.getElementById("playlist-title");
    const modalAuthor = document.getElementById("playlist-creator");
    const modalSongs = document.querySelector(".song-list");
    const shuffleBtn = document.getElementById("shuffle");
    const searchInput = document.getElementById("playlist-search"); // search functionality
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-btn");

    let allPlaylists = []; 
    let currentPlaylist = null;

    //  1) load playlists via fetch().then() chaining - fetching and storing playlists -> then render
    fetch("data.json")
    .then((response) => {
        if(!response.ok) {  // if haven't received data
            throw new Error("Network error: " + response.status);
        }
        return response.json();  // data is received
    })
    .then((data) => {
        allPlaylists = data.playlists; // Store all playlists
        renderPlaylists(allPlaylists); // Initial render
    })
    .catch((err) => {
        console.error("Failed to load playlists:", err);
    });

    // Helper function to render playlists
    function renderPlaylists(playlists) {
        container.innerHTML = ""; // Clear old cards
        playlists.forEach(createPlaylistTile);
        if (playlists.length === 0) {
            container.innerHTML = "<p style='color: #fff; text-align:center;'>No playlists found.</p>";
        }
    }

    // 2) creating each card
    function createPlaylistTile(pl) {
        const tile = document.createElement("section");
        tile.className = "music-card";
        tile.innerHTML = `
            <div class="card-img-container">
                <img src="assets/img/${pl.playlist_art}" alt="${pl.playlist_name}">
            </div>
            <h2>${pl.playlist_name}</h2>
            <p>${pl.playlist_author}</p>
            <div class="like-container">
                <img src="assets/img/empty-like.png" class="like-btn" alt="empty like button">
                <span class="like-count">${pl.likes}</span>
            </div>
        `;

        // open modal when clicking the tile -> but not the heart
        tile.addEventListener('click', (e) => {
            if(!e.target.classList.contains("like-container")) {
                openModal(pl);  // tbd
            }
        });

        // toggle like/unlike
        const heart = tile.querySelector(".like-btn");
        const count = tile.querySelector(".like-count");
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            let n = parseInt(count.textContent, 10);
            if(heart.classList.contains('liked')) {
                heart.classList.remove('liked');
                heart.src = "assets/img/empty-like.png";  // default empty heart
                count.textContent = --n;  // decrementing like
            } else {
                heart.classList.add('liked');
                heart.src = "assets/img/liked.png";
                count.textContent = ++n;
            }
        });

        container.appendChild(tile);
    }

    // 3) populate and show modal
    function openModal(pl) {
        modalArt.src = "assets/img/" + pl.playlist_art;
        modalName.textContent = pl.playlist_name;
        modalAuthor.textContent = "By: " + pl.playlist_author;
        modalSongs.innerHTML = "";
        currentPlaylist = pl;
        pl.songs.forEach((s) => {
            const row = document.createElement("div");
            row.className = "song-row";
            row.innerHTML = `
            <img class="song-thumb" src="assets/img/${s.img}" alt="Song">
            <div class="song-meta">
                <div class="song-title">${s.title}</div>
                <div class="song-artist">${s.artist}</div>
                <div class="song-album">${s.album ? s.album : ""}</div>
            </div>
            <div class="song-duration">${s.duration}</div>
        `;
            modalSongs.appendChild(row);
        });
        modal.classList.add("show");
    }

    // shuffleArray
    function shuffleArray(array) {  // fisher-yates shuffle yay
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    }

    // 4) open / close handers / shuffle
    shuffleBtn.addEventListener("click", () => {
        shuffleArray(currentPlaylist.songs); 
        modalSongs.innerHTML = "";  // clear list from before to avoid duplicates
        currentPlaylist.songs.forEach((s) => {
            const row = document.createElement("div");
            row.className = "song-row";
            row.innerHTML = `
            <img class="song-thumb" src="assets/img/${s.img}" alt="Song">
            <div class="song-meta">
                <div class="song-title">${s.title}</div>
                <div class="song-artist">${s.artist}</div>
                <div class="song-album">${s.album ? s.album : ""}</div>
            </div>
            <div class="song-duration">${s.duration}</div>
        `;
            modalSongs.appendChild(row);
        });
    });
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });

    // 5) search yay -> listen to input -> filter playlists
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();  // lower case !!
            if (!query) {
                renderPlaylists(allPlaylists);  // using helper function :3
                return;
            }
            const filtered = allPlaylists.filter(pl =>
                pl.playlist_name.toLowerCase().includes(query) ||
                pl.playlist_author.toLowerCase().includes(query)
            );
            renderPlaylists(filtered);
        });
        if (searchBtn) {
            searchBtn.addEventListener("click", () => {
                const query = searchInput.value.trim().toLowerCase();
                if (!query) {
                    renderPlaylists(allPlaylists);
                    return;
                }
                const filtered = allPlaylists.filter(pl =>
                    pl.playlist_name.toLowerCase().includes(query) ||
                    pl.playlist_author.toLowerCase().includes(query)
                );
                renderPlaylists(filtered);
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                searchInput.value = "";
                renderPlaylists(allPlaylists);
                searchInput.focus();
            });
        }
    }
})
