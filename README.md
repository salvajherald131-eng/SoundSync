
# SoundSync

SoundSync is a music library web application built with HTML,
CSS, JavaScript, Node.js, Express, and MySQL.

## Features

- View the music library
- Search songs and artists
- Add songs
- View individual song details through the API
- Delete songs through the API
- Store music information in a local MySQL database
- Responsive music-themed interface

## Requirements

- Node.js and npm
- MySQL Server or XAMPP with MySQL/MariaDB

## Installation

1. Open the project folder in VS Code.
2. Start your local MySQL server.
3. Run database/schema.sql in MySQL.
4. Run database/data.sql to insert sample songs.
5. Configure your .env file.
6. Open the terminal in the project directory.
7. Install dependencies:

   npm install

8. Start the application:

   npm start

9. Open http://localhost:3000 in your browser.

## API Endpoints

GET    /api/songs
GET    /api/songs/:id
POST   /api/songs
DELETE /api/songs/:id

## Important

Keep .env private. Never commit database credentials
to a public repository.
