
const model = require("../models/soundSyncModel");

async function getSongs(req, res, next) {
    try {
        const songs = await model.getAllSongs();
        res.json(songs);
    } catch (error) {
        next(error);
    }
}

async function getSong(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                message: "Invalid song ID."
            });
        }

        const song = await model.getSongById(id);

        if (!song) {
            return res.status(404).json({
                message: "Song not found."
            });
        }

        res.json(song);
    } catch (error) {
        next(error);
    }
}

async function addSong(req, res, next) {
    try {
        const {
            title, artist, album, genre, duration, cover_url
        } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof artist !== "string" ||
            !artist.trim()
        ) {
            return res.status(400).json({
                message: "Song title and artist are required."
            });
        }

        if (
            title.trim().length > 150 ||
            artist.trim().length > 150 ||
            (album != null &&
                (typeof album !== "string" || album.length > 150)) ||
            (genre != null &&
                (typeof genre !== "string" || genre.length > 80))
        ) {
            return res.status(400).json({
                message: "One or more fields exceed their allowed length."
            });
        }

        if (
            duration != null &&
            (!Number.isSafeInteger(duration) || duration < 1 ||
             duration > 4294967295)
        ) {
            return res.status(400).json({
                message: "Duration must be a positive whole number."
            });
        }

        if (
            cover_url != null &&
            (typeof cover_url !== "string" || cover_url.length > 2048)
        ) {
            return res.status(400).json({
                message: "Invalid cover image URL."
            });
        }

        if (cover_url) {
            try {
                const url = new URL(cover_url);

                if (!["http:", "https:"].includes(url.protocol)) {
                    throw new Error("Invalid protocol");
                }
            } catch {
                return res.status(400).json({
                    message: "Cover URL must be a valid HTTP or HTTPS URL."
                });
            }
        }

        const song = await model.createSong({
            title: title.trim(),
            artist: artist.trim(),
            album: album?.trim() || null,
            genre: genre?.trim() || null,
            duration: duration ?? null,
            cover_url: cover_url?.trim() || null
        });

        res.status(201).json({
            message: "Song added successfully.",
            song
        });
    } catch (error) {
        next(error);
    }
}

async function removeSong(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                message: "Invalid song ID."
            });
        }

        const deleted = await model.deleteSong(id);

        if (!deleted) {
            return res.status(404).json({
                message: "Song not found."
            });
        }

        res.json({ message: "Song deleted successfully." });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSongs,
    getSong,
    addSong,
    removeSong
};
