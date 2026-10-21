
require("dotenv").config();

const app = require("./backend/server");
const db = require("./backend/config/db");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        const connection = await db.getConnection();
        await connection.ping();
        connection.release();

        console.log("MySQL database connected.");

        app.listen(PORT, () => {
            console.log(`SoundSync running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to MySQL:", error.message);
        process.exit(1);
    }
}

startServer();

