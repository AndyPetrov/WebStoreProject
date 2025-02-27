CREATE DATABASE `webstore`;
USE `webstore`;

-- Roles table for User Types (admin, customer, etc.)
CREATE TABLE `roles` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_name` ENUM('admin', 'customer', 'premium') NOT NULL UNIQUE
);

-- Users table remains mostly the same, but you can modify roles
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `profile_picture_url` VARCHAR(255) DEFAULT 'https://imgur.com/a/el5idNE',
    `role_id` INT NOT NULL DEFAULT 2,
    `subscription_id` INT DEFAULT 1,  -- to link to subscriptions for premium users
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Artists table (renaming authors to better represent music industry terms)
CREATE TABLE `artists` (
    `artist_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `biography` TEXT,
    `date_of_birth` DATE NOT NULL,
    `profile_picture_url` VARCHAR(255) NOT NULL DEFAULT 'https://imgur.com/a/el5idNE'
);

-- Genres table for music categorization
CREATE TABLE `genres` (
    `genre_id` INT AUTO_INCREMENT PRIMARY KEY,
    `genre_name` VARCHAR(255) NOT NULL UNIQUE
);

-- Albums table with additional fields like `release_date`
CREATE TABLE `albums` (
    `album_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `artist_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
    `release_date` DATE,
    `cover_image_url` VARCHAR(255) DEFAULT 'https://imgur.com/a/el5idNE',
    `price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`artist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tracks (songs) table with more detailed data for Spotify-like functionality
CREATE TABLE `tracks` (
    `track_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `album_id` INT NOT NULL,
    `artist_id` INT NOT NULL,
    `duration_seconds` INT NOT NULL,  -- storing duration in seconds
    `track_number` INT NOT NULL,
    `audio_url` VARCHAR(255) NOT NULL,  -- URL to audio file
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`artist_id`) REFERENCES `artists`(`artist_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Playlist table for users to manage their personal playlists
CREATE TABLE `playlists` (
    `playlist_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `playlist_name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Playlist songs table to associate tracks with playlists
CREATE TABLE `playlist_tracks` (
    `playlist_id` INT NOT NULL,
    `track_id` INT NOT NULL,
    PRIMARY KEY (`playlist_id`, `track_id`),
    FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON DELETE CASCADE,
    FOREIGN KEY (`track_id`) REFERENCES `tracks`(`track_id`) ON DELETE CASCADE
);

-- User streaming history (for playback tracking)
CREATE TABLE `streaming_history` (
    `history_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `track_id` INT NOT NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`track_id`) REFERENCES `tracks`(`track_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `subscription_types` (
    `subscription_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `type_name` VARCHAR(255) NOT NULL UNIQUE,  -- e.g. 'free', 'basic', 'premium'
    `price` DOUBLE(10,2) NOT NULL,  -- Price for the subscription type
    `description` TEXT  -- Optional description for each subscription type
);

-- Modify the subscriptions table to reference the new subscription_types table
CREATE TABLE `subscriptions` (
    `subscription_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `subscription_type_id` INT NOT NULL,  -- Now referencing subscription_types
    `start_date` DATE NOT NULL,
    `end_date` DATE,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`subscription_type_id`) REFERENCES `subscription_types`(`subscription_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Payment methods for users
CREATE TABLE `payment_methods` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `method_type` ENUM('Debit Card', 'PayPal', 'Google Pay', 'On Pickup') NOT NULL,
    `payment_details` TEXT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Reviews for products (like albums or individual tracks)
CREATE TABLE `reviews` (
    `review_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,  -- can represent albums or tracks
    `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `review_text` TEXT,
    `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
	 ON DELETE CASCADE 
	 ON UPDATE CASCADE
);

-- Insert roles for admin and users
INSERT INTO `roles` (`role_name`) VALUES ('admin'), ('customer'), ('premium');