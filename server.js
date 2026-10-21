
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json({ limit: "20kb" }));

// Serve the frontend website.
app.use(express.static(
    path.join(__dirname, "..", "frontend")
));

// API routes.
app.use("/api", require("./routes/apiRoutes"));

app.use((req, res) => {
    res.status(404).json({
        message: "Requested resource not found."
    });
});

// Central error handler.
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: "An internal server error occurred."
    });
});

module.exports = app;
