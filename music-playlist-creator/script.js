document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".playlist-cards");
    const modal = document.getElementById("music-modal");
    const closeBtn = modal.querySelector(".close");
    const modalArt = document.querySelector(".playlist-cover");
    const modalName = document.getElementById("playlist-title");
    const modalAuthor = document.getElementById("playlist-creator");
    const modalSongs = document.querySelector(".song-list");
    const shuffleBtn = document.getElementById("shuffle");
    
    let currentPlaylist = null;

    //  1) load playlists via fetch().then() chaining
    fetch("data.json")
    .then((response) => {
        if(!response.ok) {  // if haven't received data
            throw new Error("Network error: " + response.status);
        }
        return response.json();  // data is received
    })
    .then((data) => {
        data.playlists.forEach(createPlaylistTile);
    })
    .catch((err) => {
        console.error("Failed to load playlists:", err);
    });

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
            <img class="song-thumb" src="assets/img/song.png" alt="Song">
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

})
