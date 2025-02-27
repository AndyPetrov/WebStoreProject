-- Insert example roles
-- INSERT INTO `roles` (`role_name`) VALUES 
-- ('admin'), 
-- ('customer'), 
-- ('premium');

-- Insert Users
INSERT INTO `users` (`username`, `name`, `surname`, `email`, `password`, `role_id`, `subscription_id`) VALUES
('johndoe', 'John', 'Doe', 'johndoe@example.com', 'password123', 1, NULL),
('janedoe', 'Jane', 'Doe', 'janedoe@example.com', 'password456', 2, NULL),
('bobsmith', 'Bob', 'Smith', 'bobsmith@example.com', 'password789', 3, 1),
('alicebrown', 'Alice', 'Brown', 'alicebrown@example.com', 'password101', 2, NULL),
('chrisjohnson', 'Chris', 'Johnson', 'chrisjohnson@example.com', 'password112', 1, 2),
('karenwhite', 'Karen', 'White', 'karenwhite@example.com', 'password131', 2, NULL),
('lukegreen', 'Luke', 'Green', 'lukegreen@example.com', 'password415', 2, NULL),
('emilydavis', 'Emily', 'Davis', 'emilydavis@example.com', 'password161', 2, 1),
('michaelscott', 'Michael', 'Scott', 'michaelscott@example.com', 'password171', 1, 3),
('jessicawilson', 'Jessica', 'Wilson', 'jessicawilson@example.com', 'password181', 3, 2);

-- Insert Artists
INSERT INTO `artists` (`name`, `biography`, `date_of_birth`, `profile_picture_url`) VALUES
('Pink Floyd', 'An iconic English rock band formed in London.', '1965-01-01', 'https://imgur.com/pinkfloyd'),
('AC/DC', 'A legendary rock band from Australia.', '1973-02-01', 'https://imgur.com/acdc'),
('The Beatles', 'English rock band formed in Liverpool.', '1960-01-01', 'https://imgur.com/thebeatles'),
('Michael Jackson', 'The King of Pop, an American singer and dancer.', '1958-08-29', 'https://imgur.com/michaeljackson'),
('Bruce Springsteen', 'American singer-songwriter, known as "The Boss".', '1949-09-23', 'https://imgur.com/brucespringsteen'),
('Fleetwood Mac', 'British-American rock band formed in London.', '1967-07-01', 'https://imgur.com/fleetwoodmac'),
('Queen', 'British rock band known for its flamboyant lead singer.', '1970-07-01', 'https://imgur.com/queen'),
('The Eagles', 'American rock band formed in Los Angeles.', '1971-01-01', 'https://imgur.com/eagles'),
('Elton John', 'English singer, pianist, and composer.', '1947-03-25', 'https://imgur.com/eltonjohn'),
('Led Zeppelin', 'British rock band known for their heavy sound.', '1968-01-01', 'https://imgur.com/ledzeppelin');

-- Insert Genres
INSERT INTO `genres` (`genre_name`) VALUES
('Rock'),
('Pop'),
('Classical'),
('Jazz'),
('Hip Hop'),
('Electronic'),
('Country'),
('Blues'),
('Reggae'),
('Metal');

-- Insert Albums with Specified Genre IDs between 1 and 10
INSERT INTO `albums` (`title`, `artist_id`, `genre_id`, `release_date`, `cover_image_url`, `price`) VALUES
('The Dark Side of the Moon', 1, 3, '1973-03-01', 'static/images/album_images/The_Dark_Side_of_the_Moon', 20.00),
('Highway to Hell', 2, 5, '1979-07-27', 'static/images/album_images/Highway_to_Hell', 15.00),
('Sgt. Pepper\'s Lonely Hearts Club Band', 3, 1, '1967-05-26', 'static/images/album_images/Sgt_Peppers_Lonely_Hearts_Club_Band', 25.00),
('Bad', 4, 8, '1987-08-31', 'static/images/album_images/Bad', 18.00),
('The River', 5, 4, '1980-10-17', 'static/images/album_images/The_River', 22.00),
('Tango in the Night', 6, 7, '1987-04-13', 'static/images/album_images/Tango_in_the_Night', 20.00),
('Innuendo', 7, 2, '1991-02-04', 'static/images/album_images/Innuendo', 21.00),
('Greatest Hits', 8, 6, '1976-02-22', 'static/images/album_images/Greatest_Hits', 18.00),
('Goodbye Yellow Brick Road', 9, 9, '1973-10-05', 'static/images/album_images/Goodbye_Yellow_Brick_Road', 24.00),
('Physical Graffiti', 10, 10, '1975-02-24', 'static/images/album_images/Physical_Graffiti', 23.00);


-- Insert Tracks for Albums
INSERT INTO `tracks` (`title`, `album_id`, `artist_id`, `duration_seconds`, `track_number`, `audio_url`) VALUES
('Breathe', 1, 1, 167, 1, 'https://audio.com/breathe.mp3'),
('Time', 1, 1, 412, 2, 'https://audio.com/time.mp3'),
('Money', 1, 1, 382, 3, 'https://audio.com/money.mp3'),
('Highway to Hell', 2, 2, 208, 1, 'https://audio.com/highwaytohell.mp3'),
('Hell Ain\'t a Bad Place to Be', 2, 2, 217, 2, 'https://audio.com/hellaintabadplacetobe.mp3'),
('Girls Got Rhythm', 2, 2, 231, 3, 'https://audio.com/girlsgotrhythm.mp3'),
('A Day in the Life', 3, 3, 378, 1, 'https://audio.com/adayinthelife.mp3'),
('Lucy in the Sky with Diamonds', 3, 3, 203, 2, 'https://audio.com/lucyinthesky.mp3'),
('With a Little Help from My Friends', 3, 3, 173, 3, 'https://audio.com/withalittlehelp.mp3'),
('Bad', 4, 4, 255, 1, 'https://audio.com/bad.mp3');

-- Insert Playlists
INSERT INTO `playlists` (`user_id`, `playlist_name`, `description`) VALUES
(1, 'My Rock Classics', 'A collection of rock classics'),
(2, 'My 80s Hits', 'All-time favorite 80s hits'),
(3, 'The Beatles Best', 'The ultimate Beatles playlist'),
(4, 'Michael Jackson Hits', 'The King of Pop’s best tracks'),
(5, 'Springsteen\'s Greatest', 'Songs from Bruce Springsteen'),
(6, 'Eagles Classics', 'Timeless Eagles hits'),
(7, 'Beatles Gold', 'Classic Beatles tracks'),
(8, 'Fleetwood Mac Tunes', 'Best of Fleetwood Mac'),
(9, 'Queen\'s Greatest', 'Legendary Queen tracks'),
(10, 'Best of Pink Floyd', 'Floyd at their best');

-- Insert Playlist Tracks (ensure we reference only available tracks)
INSERT INTO `playlist_tracks` (`playlist_id`, `track_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);


-- Insert Streaming History for users
INSERT INTO `streaming_history` (`user_id`, `track_id`, `timestamp`) VALUES
(1, 1, '2025-02-16 12:00:00'),
(1, 2, '2025-02-16 12:05:00'),
(2, 4, '2025-02-16 12:10:00'),
(2, 5, '2025-02-16 12:20:00'),
(3, 7, '2025-02-16 13:00:00'),
(3, 8, '2025-02-16 13:05:00'),
(4, 3, '2025-02-16 14:00:00'),
(4, 6, '2025-02-16 14:15:00'),
(5, 9, '2025-02-16 15:00:00'),
(5, 10, '2025-02-16 15:10:00');

-- Insert Subscription Types
INSERT INTO `subscription_types` (`type_name`, `price`, `description`) VALUES
('Free', 0.00, 'Limited access to content with advertisements'),
('Basic', 5.00, 'Access to all content with no ads'),
('Premium', 15.00, 'Full access to all content, exclusive features, and ad-free experience');

-- Insert Subscriptions
INSERT INTO `subscriptions` (`user_id`, `subscription_type_id`, `start_date`, `end_date`, `status`) VALUES
(1, 1, '2025-01-01', '2025-01-31', 'active'),  -- Free plan for user 1
(2, 2, '2025-02-01', '2026-02-01', 'active'),  -- Basic plan for user 2
(3, 3, '2025-02-15', '2026-02-15', 'active'),  -- Premium plan for user 3
(4, 1, '2025-02-01', '2025-02-28', 'inactive'),  -- Free plan for user 4
(5, 2, '2025-01-01', '2026-01-01', 'active'),  -- Basic plan for user 5
(6, 3, '2025-02-01', '2026-02-01', 'inactive'),  -- Premium plan for user 6
(7, 1, '2025-02-01', '2025-02-28', 'active'),  -- Free plan for user 7
(8, 2, '2025-01-01', '2026-01-01', 'active'),  -- Basic plan for user 8
(9, 3, '2025-02-15', '2026-02-15', 'active'),  -- Premium plan for user 9
(10, 1, '2025-01-01', '2025-01-31', 'inactive');  -- Free plan for user 10

-- Insert Payment Methods
INSERT INTO `payment_methods` (`user_id`, `method_type`, `payment_details`) VALUES
(1, 'Debit Card', 'Visa ending in 1234'),
(2, 'PayPal', 'paypal@example.com'),
(3, 'Google Pay', 'googlepay@example.com'),
(4, 'Google Pay', 'googlepayuser7@example.com'),
(5, 'Debit Card', 'MasterCard ending in 5678'),
(6, 'PayPal', 'anotherpaypal@example.com'),
(7, 'Google Pay', 'googlepayuser7@example.com'),
(8, 'Google Pay', 'googlepayuser7@example.com'),
(9, 'Debit Card', 'Visa ending in 9012'),
(10, 'PayPal', 'user10paypal@example.com');

-- Insert Reviews for Products
INSERT INTO `reviews` (`user_id`, `product_id`, `rating`, `review_text`, `review_date`) VALUES
(1, 1, 5, 'Absolutely mind-blowing album! A masterpiece of progressive rock.', '2025-02-16 12:00:00'),
(2, 2, 4, 'Great rock album, but some songs feel a bit repetitive.', '2025-02-16 12:05:00'),
(3, 3, 5, 'One of the best albums of all time. A true classic!', '2025-02-16 12:10:00'),
(4, 4, 5, 'The King of Pop! Timeless hits that never get old.', '2025-02-16 12:15:00'),
(5, 5, 4, 'Great rock songs, but a bit long at times.', '2025-02-16 12:20:00'),
(6, 6, 5, 'This album is fantastic, full of energy and great melodies.', '2025-02-16 12:25:00'),
(7, 7, 4, 'Great hits, but some songs could be more experimental.', '2025-02-16 12:30:00'),
(8, 8, 3, 'Some good tracks, but I expected more from Fleetwood Mac.', '2025-02-16 12:35:00'),
(9, 9, 5, 'Queen is legendary! Every song is pure magic!', '2025-02-16 12:40:00'),
(10, 10, 5, 'Pink Floyd is a true musical genius. Their albums never disappoint.', '2025-02-16 12:45:00');
