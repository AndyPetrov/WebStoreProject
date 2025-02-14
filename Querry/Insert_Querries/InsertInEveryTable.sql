
   -- Insert genres
    INSERT INTO `genres` (`genre`) 
    VALUES 
        ('Hip Hop'),
        ('Pop'),
        ('Rock');
   
	   -- Insert authors
    INSERT INTO `authors` (`author`, `date_of_birth`, `author_info`) 
    VALUES 
        ('Kanye West', '1977-06-08', 'American rapper, singer, songwriter, record producer, and fashion designer'),
        ('Taylor Swift', '1989-12-13', 'American singer-songwriter, known for narrative songs about her personal life'),
        ('Metallica', '1981-10-28', 'American heavy metal band founded by drummer Lars Ulrich and guitarist James Hetfield');     
		          
   -- Insert albums
    INSERT INTO `albums` (`name`, `author_id`, `genre_id`, `duration`, `tracks`, `price`, `picture_path`) 
    VALUES 
        ('The College Dropout', 1, 1, '1:14:12', 21, 14.99, 'https://example.com/college_dropout.jpg'),
        ('1989', 2, 2, '1:09:02', 13, 12.99, 'https://example.com/1989.jpg'),
        ('Master of Puppets', 3, 3, '1:00:33', 8, 16.99, 'https://example.com/master_of_puppets.jpg');
        
	-- Insert roles - If there is different thing that you wanna add uncomment it (comment because makes an error) - they already exist
   -- INSERT INTO `roles` (`role_name`) VALUES ('admin'), ('customer');

	 -- Insert users
    INSERT INTO `users` (`username`, `name`, `surname`, `email`, `password`, `profile_picture_url`, `role_id`) 
    VALUES 
      ('admin1', 'Admin', 'One', 'admin1@webstore.com', 'password123', 'https://example.com/profile1.jpg', 1),
      ('customer1', 'John', 'Doe', 'john.doe@webstore.com', 'password123', 'https://example.com/profile2.jpg', 2);
   
   -- Insert product types (if type_id is missing)
	INSERT INTO `product_types` (`type`)
	VALUES 
    ('T-shirt'), 
    ('Hoodie'), 
    ('Sneakers'), 
    ('Poster'), 
    ('Figurine');
   
    -- Insert products
    INSERT INTO `products` (`type_id`, `name`, `price`, `description`, `genre_id`, `author_id`) 
    VALUES
        (1, 'Kanye West T-shirt', 25.99, 'Limited edition Kanye West tour T-shirt', 1, 1),
        (2, 'Kanye West Hoodie', 49.99, 'Kanye West tour hoodie, comfortable and stylish', 1, 1),
        (3, 'Kanye West Sneakers', 99.99, 'Yeezy brand sneakers by Kanye West', 1, 1),
        (4, 'Kanye West Poster', 9.99, 'Kanye West poster from the 2020 tour', 1, 1),
        (5, 'Kanye West Figurine', 39.99, 'Kanye West collectible action figure', 1, 1);
      
   -- Insert cart items
    INSERT INTO `cart_items` (`user_id`, `product_id`, `quantity`) 
    VALUES 
        (1, 1, 2), 
        (2, 3, 1);

  
        
   -- Insert discounts
    INSERT INTO `discounts` (`product_id`, `discount_type`, `discount_value`, `start_date`, `end_date`) 
    VALUES 
        (1, 'percentage', 10.00, '2025-02-01', '2025-02-28'),
        (2, 'fixed', 5.00, '2025-02-01', '2025-02-28');
          
   -- Insert order statuses
    INSERT INTO `order_statuses` (`status_name`) 
    VALUES ('Pending'), ('Shipped'), ('Delivered'), ('Cancelled');
    
   -- Insert payment methods
    INSERT INTO `payment_methods` (`user_id`, `method_type`, `payment_details`) 
    VALUES 
        (1, 'Credit Card', '**** **** **** 1234'),
        (2, 'PayPal', 'paypal@user.com');
        
   -- Insert product images
    INSERT INTO `product_images` (`image_path`, `product_id`) 
    VALUES 
        ('example_path', 1), ('example_path', 2), ('example_path', 3), ('example_path', 4),
        ('example_path', 5);
         
   -- Insert purchases
    INSERT INTO `purchases` (`user_id`, `total_price`, `products`, `status_id`) 
    VALUES 
        (1, 79.99, 'Kanye West T-shirt, Kanye West Hoodie', 1),
        (2, 39.99, 'Kanye West Sneakers', 2);
        
   -- Insert reviews
    INSERT INTO `reviews` (`user_id`, `product_id`, `rating`, `review_text`) 
    VALUES 
        (1, 1, 5, 'Great product, love the design!'),
        (2, 3, 4, 'Comfortable sneakers, but a bit pricey.');
           
   -- Insert songs (selected)
    INSERT INTO `songs` (`name`, `author_id`, `genre_id`, `duration`, `track_position`, `album_id`) 
    VALUES
      ('Through the Wire', 1, 1, '3:25', 1, 1),
      ('Slow Jamz', 1, 1, '5:05', 2, 1),
      ('All Too Well', 2, 2, '5:29', 1, 2),
      ('Shake It Off', 2, 2, '3:39', 2, 2),
      ('Battery', 3, 3, '5:12', 1, 3),
      ('Enter Sandman', 3, 3, '5:31', 2, 3), 
      ('Stronger', 1, 1, '5:11', 1, 3),
    	('Good Life', 1, 1, '4:27', 2, 3),
    	('I Wonder', 1, 1, '4:05', 3, 3),
    	('Can''t Tell Me Nothing', 1, 1, '4:31', 4, 3),
    	('Barry Bonds', 1, 1, '3:08', 5, 3),
    	('Drunk and Hot Girls', 1, 1, '4:49', 6, 3),
    	('Flashing Lights', 1, 1, '3:57', 7, 3),
    	('Everything I Am', 1, 1, '3:58', 8, 3),
    	('Last Call (Reprise)', 1, 1, '4:59', 9, 3),
    	('Homecoming', 1, 1, '3:24', 10, 3),
    	('Big Brother', 1, 1, '4:25', 11, 3),
    	('Heartless', 1, 1, '3:31', 1, 2),
    	('Love Lockdown', 1, 1, '4:29', 2, 2),
    	('Paranoid', 1, 1, '3:13', 3, 1),
    	('Robocop', 1, 1, '4:50', 4, 1),
    	('Street Lights', 1, 1, '4:11', 5, 2),
    	('Bad News', 1, 1, '3:59', 6, 3),
    	('See You In My Nightmares', 1, 1, '4:47', 7, 1),
    	('Coldest Winter', 1, 1, '3:20', 8, 1),
    	('Pinocchio Story', 1, 1, '3:49', 9, 2),
    	('Power', 1, 1, '4:52', 1, 3),
    	('Monster', 1, 1, '6:19', 2, 3),
    	('So Appalled', 1, 1, '6:38', 3, 2),
    	('Devil in a New Dress', 1, 1, '5:49', 4, 1),
    	('Runaway', 1, 1, '9:08', 5, 2),
    	('Hell of a Life', 1, 1, '6:23', 6, 3),
    	('Blame Game', 1, 1, '7:50', 7, 1),
    	('Lost in the World', 1, 1, '4:16', 8, 2),
    	('Who Will Survive in America', 1, 1, '2:30', 9, 1);
  
        
