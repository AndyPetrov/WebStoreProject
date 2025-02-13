
    -- Insert albums
    INSERT INTO `albums` (`name`, `author_id`, `genre_id`, `duration`, `tracks`, `price`, `picture_path`) 
    VALUES 
        ('The College Dropout', 1, 1, '1:14:12', 21, 14.99, 'https://example.com/college_dropout.jpg'),
        ('1989', 2, 2, '1:09:02', 13, 12.99, 'https://example.com/1989.jpg'),
        ('Master of Puppets', 3, 3, '1:00:33', 8, 16.99, 'https://example.com/master_of_puppets.jpg');
    