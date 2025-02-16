-- Insert example roles
-- INSERT INTO `roles` (`role_name`) VALUES 
-- ('admin'), 
-- ('customer'), 
-- ('premium');

-- Insert sample users
INSERT INTO `users` (`username`, `name`, `surname`, `email`, `password`, `profile_picture_url`, `role_id`, `subscription_id`) VALUES
('john_doe', 'John', 'Doe', 'john.doe@example.com', 'password123', 'https://imgur.com/a/el5idNE', 2, NULL),
('jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'password456', 'https://imgur.com/a/el5idNE', 3, 1);  -- premium user

-- Insert sample artists
INSERT INTO `artists` (`name`, `biography`, `date_of_birth`, `profile_picture_url`) VALUES
('Taylor Swift', 'American singer-songwriter.', '1989-12-13', 'https://imgur.com/a/el5idNE'),
('Ed Sheeran', 'English singer-songwriter and record producer.', '1991-02-17', 'https://imgur.com/a/el5idNE');

-- Insert sample genres
INSERT INTO `genres` (`genre_name`) VALUES 
('Pop'),
('Rock'),
('Country');

-- Insert sample albums
INSERT INTO `albums` (`title`, `artist_id`, `genre_id`, `release_date`, `cover_image_url`, `price`) VALUES
('1989', 1, 1, '2014-10-27', 'https://imgur.com/a/el5idNE', 9.99),
('Divide', 2, 1, '2017-03-03', 'https://imgur.com/a/el5idNE', 11.99);

-- Insert sample tracks (songs)
INSERT INTO `tracks` (`title`, `album_id`, `artist_id`, `duration_seconds`, `track_number`, `audio_url`) VALUES
('Shake It Off', 1, 1, 219, 1, 'https://example.com/shake_it_off.mp3'),
('Shape of You', 2, 2, 233, 1, 'https://example.com/shape_of_you.mp3');

-- Insert sample playlists
INSERT INTO `playlists` (`user_id`, `playlist_name`, `description`) VALUES
(1, 'John’s Favorite Songs', 'A collection of John’s favorite tracks'),
(2, 'Jane’s Workout Playlist', 'Upbeat songs for a great workout');

-- Insert sample playlist tracks (associating tracks with playlists)
INSERT INTO `playlist_tracks` (`playlist_id`, `track_id`) VALUES
(1, 1),
(2, 2);

-- Insert sample streaming history
INSERT INTO `streaming_history` (`user_id`, `track_id`, `timestamp`) VALUES
(1, 1, '2025-02-16 12:00:00'),
(2, 2, '2025-02-16 12:05:00');

-- Insert sample subscriptions
INSERT INTO `subscriptions` (`user_id`, `subscription_type`, `start_date`, `end_date`, `status`) VALUES
(1, 'free', '2025-01-01', NULL, 'active'),
(2, 'premium', '2025-01-01', '2026-01-01', 'active');

-- Insert sample payment methods
INSERT INTO `payment_methods` (`user_id`, `method_type`, `payment_details`) VALUES
(2, 'Debit Card', '{"card_number": "1234-5678-9876-5432", "expiry": "12/25", "billing_address": "123 Main St"}');

-- Insert sample reviews for products (albums or tracks)
INSERT INTO `reviews` (`user_id`, `product_id`, `rating`, `review_text`) VALUES
(1, 1, 5, 'Absolutely love this album! It’s a masterpiece!'),
(2, 2, 4, 'Great song, but it could be a bit longer.');
