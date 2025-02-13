
    -- Insert users
    INSERT INTO `users` (`username`, `name`, `surname`, `email`, `password`, `profile_picture_url`, `role_id`) 
    VALUES 
        ('admin1', 'Admin', 'One', 'admin1@webstore.com', 'password123', 'https://example.com/profile1.jpg', 1),
        ('customer1', 'John', 'Doe', 'john.doe@webstore.com', 'password123', 'https://example.com/profile2.jpg', 2);
    