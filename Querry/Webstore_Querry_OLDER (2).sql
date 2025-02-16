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
    `role_id` INT NOT NULL DEFAULT 2
);

CREATE TABLE `roles` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_name` ENUM('admin', 'customer') NOT NULL UNIQUE
);

ALTER TABLE `users`
ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`)
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE `purchases` (
    `purchase_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `total_price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
    `products` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
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
    `price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
    `picture_path` VARCHAR(255) NOT NULL DEFAULT 'https://drive.google.com/file/d/1Wx2jBd67An9CkReaSKEMha-CEIeLiBkS/view?usp=drive_link',
    FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `songs` (
    `song_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `author_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
    `duration` VARCHAR(255) NOT NULL,
    `track_position` INT NOT NULL,
    `album_id` INT NOT NULL,
    FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`album_id`) REFERENCES `albums`(`album_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `product_types` (
    `type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `products` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `type_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
    `description` TEXT NOT NULL,
    `genre_id` INT NOT NULL,
    `author_id` INT NOT NULL,
    FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`type_id`) REFERENCES `product_types`(`type_id`)
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
    `product_id` INT NOT NULL,
    `discount_type` ENUM('fixed', 'percentage') NOT NULL,
    `discount_value` DOUBLE(10,2) NOT NULL,
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `cart_items` (
    `cart_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `order_statuses` (
    `status_id` INT AUTO_INCREMENT PRIMARY KEY,
    `status_name` ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') NOT NULL UNIQUE
);

ALTER TABLE `purchases`
ADD COLUMN `status_id` INT NOT NULL DEFAULT 1,
ADD FOREIGN KEY (`status_id`) REFERENCES `order_statuses`(`status_id`)
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE `reviews` (
    `review_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `review_text` TEXT,
    `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `payment_methods` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `method_type` ENUM('Debit Card', 'PayPal', 'Google Pay', 'On Pickup') NOT NULL,
    `payment_details` TEXT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `roles` (`role_name`) VALUES ('admin'), ('customer');
