CREATE DATABASE `webstore`;
USE `webstore`;
music_videos
-- Users table
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `profile_picture_url` VARCHAR(255) DEFAULT 'https://imgur.com/a/el5idNE',
    `subscription_type` ENUM('free', 'premium') NOT NULL DEFAULT 'free',
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE RESTRICT
);

-- Genres
CREATE TABLE `genres` (
    `genre_id` INT AUTO_INCREMENT PRIMARY KEY,
    `genre_name` VARCHAR(255) NOT NULL UNIQUE
);

-- Artists (iTunes ID as primary key)
CREATE TABLE `artists` (
    `artist_id` BIGINT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `genre_id` INT,
    `biography` TEXT,
    `artist_image_url` VARCHAR(255),
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`) ON DELETE SET NULL
);

-- Albums (iTunes ID as primary key)
CREATE TABLE `albums` (
    `album_id` BIGINT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `artist_id` BIGINT NOT NULL,
    `genre_id` INT,
    `release_date` DATE,
    `description` TEXT,
    `cover_image_url` VARCHAR(255),
    `price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
    `explicit` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`artist_id`) ON DELETE CASCADE ,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`) ON DELETE SET NULL
);

-- Tracks (iTunes ID as primary key)
CREATE TABLE `tracks` (
    `track_id` BIGINT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `album_id` BIGINT,
    `artist_id` BIGINT NOT NULL,
    `duration_milliseconds` INT NOT NULL,
    `track_number` INT NOT NULL,
    `preview_url` VARCHAR(255),
    `price` DOUBLE(10,2) DEFAULT 0.99,
    `explicit` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`artist_id`) ON DELETE CASCADE 
);

-- Featured Artists on Tracks
CREATE TABLE `featured_artists` (
    `track_id` BIGINT NOT NULL,
    `artist_id` BIGINT NOT NULL,
    PRIMARY KEY (`track_id`, `artist_id`),
    FOREIGN KEY (`track_id`) REFERENCES `tracks`(`track_id`) ON DELETE CASCADE,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`artist_id`) ON DELETE CASCADE
);

-- Music Videos (iTunes video ID as primary key)
CREATE TABLE `music_videos` (
    `video_id` BIGINT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `artist_id` BIGINT NOT NULL,
    `album_id` BIGINT,
    `preview_url` VARCHAR(255) NOT NULL,
    `release_date` DATE,
    `duration_milliseconds` INT,
    `price` DOUBLE(10,2) DEFAULT 1.99,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`artist_id`) ON DELETE CASCADE,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`) ON DELETE SET NULL
);


-- Playlists
CREATE TABLE `playlists` (
    `playlist_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `playlist_name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Playlist Tracks
CREATE TABLE `playlist_tracks` (
    `playlist_id` INT NOT NULL,
    `track_id` BIGINT NOT NULL,
    PRIMARY KEY (`playlist_id`, `track_id`),
    FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON DELETE CASCADE,
    FOREIGN KEY (`track_id`) REFERENCES `tracks`(`track_id`) ON DELETE CASCADE
);

-- Streaming History
CREATE TABLE `streaming_history` (
    `history_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `track_id` BIGINT NOT NULL,
    `stream_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`track_id`) REFERENCES `tracks`(`track_id`) ON DELETE CASCADE
);

-- Purchase History
CREATE TABLE `purchase_history` (
    `purchase_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `item_type` ENUM('track', 'album') NOT NULL,
    `item_id` BIGINT NOT NULL,
    `price_paid` DOUBLE(10,2) NOT NULL,
    `purchase_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);
