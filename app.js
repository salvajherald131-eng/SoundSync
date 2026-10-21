
const API_URL = "/api/songs";

const songList = document.getElementById("songList");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("searchInput");
const songForm = document.getElementById("songForm");
const formMessage = document.getElementById("formMessage");

let songs = [];

function formatDuration(seconds) {
    if (!seconds) return "Duration unavailable";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Safely create text elements rather than inserting user text as HTML.
function createTextElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text ?? "";

    if (className) element.className = className;

    return element;
}

function renderSongs(songData) {
    songList.replaceChildren();

    if (songData.length === 0) {
        statusMessage.textContent = "No songs found.";
        return;
    }

    statusMessage.textContent = `${songData.length} song(s) found.`;

    songData.forEach(song => {
        const card = document.createElement("article");
        card.className = "song-card";

        const cover = document.createElement("div");
        cover.className = "cover";

        // Only allow HTTP(S) cover image URLs.
        let safeCoverUrl = null;

        try {
            if (song.cover_url) {
                const url = new URL(song.cover_url);

                if (url.protocol === "https:" || url.protocol === "http:") {
                    safeCoverUrl = url.href;
                }
            }
        } catch {
            safeCoverUrl = null;
        }

        if (safeCoverUrl) {
            const image = document.createElement("img");
            image.src = safeCoverUrl;
            image.alt = `${song.title} album cover`;
            image.loading = "lazy";

            image.addEventListener("error", () => {
                cover.replaceChildren();
                cover.textContent = "♫";
            });

            cover.appendChild(image);
        } else {
            cover.textContent = "♫";
        }

        const info = document.createElement("div");
        info.className = "song-info";

        info.appendChild(
            createTextElement("h3", song.title)
        );

        info.appendChild(
            createTextElement("p", `Artist: ${song.artist}`)
        );

        info.appendChild(
            createTextElement("p", `Album: ${song.album || "Single"}`)
        );

        const meta = document.createElement("div");
        meta.className = "song-meta";

        meta.appendChild(
            createTextElement("span", song.genre || "Uncategorized")
        );

        meta.appendChild(
            createTextElement("span", formatDuration(song.duration))
        );

        info.appendChild(meta);
        card.append(cover, info);
        songList.appendChild(card);
    });
}

async function loadSongs() {
    statusMessage.textContent = "Loading songs...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load songs.");
        }

        songs = await response.json();
        filterSongs();
    } catch (error) {
        statusMessage.textContent =
            "Unable to load songs. Please check the server and database.";
        console.error(error);
    }
}

function filterSongs() {
    const query = searchInput.value.trim().toLowerCase();

    const filteredSongs = songs.filter(song =>
        [song.title, song.artist, song.album, song.genre]
            .some(value => String(value || "").toLowerCase().includes(query))
    );

    renderSongs(filteredSongs);
}

searchInput.addEventListener("input", filterSongs);

songForm.addEventListener("submit", async event => {
    event.preventDefault();
    formMessage.textContent = "";

    const formData = new FormData(songForm);

    const title = formData.get("title").trim();
    const artist = formData.get("artist").trim();
    const album = formData.get("album").trim();
    const genre = formData.get("genre").trim();
    const durationValue = formData.get("duration");
    const coverUrl = formData.get("cover_url").trim();

    const duration = durationValue ? Number(durationValue) : null;

    if (!title || !artist) {
        formMessage.textContent = "Title and artist are required.";
        return;
    }

    if (duration !== null && (!Number.isInteger(duration) || duration < 1)) {
        formMessage.textContent = "Duration must be a positive whole number.";
        return;
    }

    const newSong = {
        title,
        artist,
        album: album || null,
        genre: genre || null,
        duration,
        cover_url: coverUrl || null
    };

    const submitButton = songForm.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newSong)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to add song.");
        }

        songForm.reset();
        formMessage.textContent = "Song added successfully!";

        await loadSongs();
    } catch (error) {
        formMessage.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});

loadSongs();
