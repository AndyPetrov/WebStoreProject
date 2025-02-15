CREATE DATABASE `webstore`;
USE `webstore`;

CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `profile_picture_url` VARCHAR(255) NOT NULL DEFAULT 'https://imgur.com/a/el5idNE',
    `role_id` INT NOT NULL DEFAULT 2,
    `subscription_id` INT NOT NULL DEFAULT 1
    FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`subscription_id`) ON DELETE CASCADE
);

CREATE TABLE `subscriptions` (
    `subscription_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` INT NOT NULL,
    `tier` ENUM('Free', 'Tier 1', 'Tier 2') NOT NULL DEFAULT 'Free',
    `start_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `end_date` TIMESTAMP NULL
);

CREATE TABLE `roles` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_name` ENUM('admin', 'customer') NOT NULL UNIQUE
);

ALTER TABLE `users`
ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`)
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE purchases (
    `purchase_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `album_id` INT NOT NULL,
    `purchase_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`) ON DELETE CASCADE
);

CREATE TABLE `authors` (
    `author_id` INT AUTO_INCREMENT PRIMARY KEY,
    `author` VARCHAR(255) NOT NULL UNIQUE,
    `date_of_birth` DATE NOT NULL,
    `author_info` TEXT
);

CREATE TABLE `genres` ( 
    `genre_id` INT AUTO_INCREMENT PRIMARY KEY,
    `genre` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `albums` (
    `album_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `author_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
    `duration` VARCHAR(255) NOT NULL,
    `tracks` INT NOT NULL,
    `image_id` INT NOT NULL DEFAULT 1,
    `price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
    FOREIGN Key (image_id) REFERENCES `product_images`(`image_id`)
);

CREATE TABLE `songs` (
    `song_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `author_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
    `audio_url` VARCHAR(500) NOT NULL,
    `track_position` INT NOT NULL,
    `album_id` INT NOT NULL,
    FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `product_images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `image_path` VARCHAR(500) NOT NULL,
    `product_id` INT NOT NULL,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
    ON DELETE CASCADE
);

CREATE TABLE `discounts` (
    `discount_id` INT AUTO_INCREMENT PRIMARY KEY,
    `album_id` INT NOT NULL,
    `discount_type` ENUM('fixed', 'percentage') NOT NULL,
    `discount_value` DOUBLE(10,2) NOT NULL,
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `cart_items` (
    `cart_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `album_id` INT NOT NULL
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`album_id`) REFERENCES `album`(`album_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `reviews` (
    `review_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `album_id` INT NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `review_text` TEXT,
    `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `payment_methods` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `method_type` ENUM('Debit Card', 'PayPal', 'Google Pay') NOT NULL,
    `payment_details` TEXT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `roles` (`role_name`) VALUES ('admin'), ('customer');
