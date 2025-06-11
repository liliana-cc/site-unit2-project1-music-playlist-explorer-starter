document.addEventListener("DOMContentLoaded", () => {
    featuredContent = document.querySelector(".featured-content");
     // populate the featured playlist
    function populateFeatured(pl) {
        // Only select elements inside .featured-content
        const cover = featuredContent.querySelector(".playlist-cover");  // selecting specifcally these selectors within featured content for more specificity
        const name = featuredContent.querySelector("#playlist-title");
        const author = featuredContent.querySelector("#playlist-creator");
        const songs = featuredContent.querySelector(".song-list");
        const shuffleBtn = featuredContent.querySelector("#shuffle");

        // shuffle - > btn specifically from featuredContent - > listener must be here else btn undefined
        shuffleBtn.addEventListener("click", () => {
            shuffleArray(currentPlaylist.songs); 
            songs.innerHTML = "";  // clear list from before to avoid duplicates
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
                songs.appendChild(row);
            });
        });
        cover.src = "assets/img/" + pl.playlist_art;
        name.textContent = pl.playlist_name;
        author.textContent = "By: " + pl.playlist_author;
        songs.innerHTML = "";

        currentPlaylist = pl;
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
                songs.appendChild(row);
        });
        featuredContent.classList.add("show");
    }

    if(featuredContent) {
        fetch("data.json")
            .then((response) => {
            if(!response.ok) {  // if haven't received data
                throw new Error("Network error: " + response.status);
            }
            return response.json();  // data is received (json is allowed to parse)
            })
            .then((data) => {
                const playlists = data.playlists;
                const randomIndex = Math.floor(Math.random() * playlists.length);
                const featured = playlists[randomIndex];
                populateFeatured(featured);
            })
            .catch((err) => {
                console.error("Failed to load playlists:", err);
            });
    }

    // shuffleArray
    function shuffleArray(array) {  // fisher-yates shuffle yay (again)
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    }

})