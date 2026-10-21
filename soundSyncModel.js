
const db = require("../config/db");

async function getAllSongs() {
    const [rows] = await db.execute(
        `SELECT id, title, artist, album, genre, duration,
                cover_url, created_at
         FROM songs
         ORDER BY id DESC`
    );

    return rows;
}

async function getSongById(id) {
    const [rows] = await db.execute(
        "SELECT * FROM songs WHERE id = ?",
        [id]
    );

    return rows[0] || null;
}

async function createSong(song) {
    const {
        title, artist, album, genre, duration, cover_url
    } = song;

    const [result] = await db.execute(
        `INSERT INTO songs
         (title, artist, album, genre, duration, cover_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, artist, album, genre, duration, cover_url]
    );

    return getSongById(result.insertId);
}

async function deleteSong(id) {
    const [result] = await db.execute(
        "DELETE FROM songs WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    getAllSongs,
    getSongById,
    createSong,
    deleteSong
};
