CREATE DATABASE `webstore`;
USE `webstore`;

CREATE TABLE `users`(
	`user_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`username` VARCHAR(255) NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`surname` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`profile_picture_url` VARCHAR(255) NOT NULL DEFAULT `https://imgur.com/a/el5idNE`,
	UNIQUE (`username`)
);

CREATE TABLE `purchases`(
	`purchase_id` AUTO_INCREMENT PRIMARY KEY
	`user_id` INT,
	`total_price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
	`products` TEXT,
	UNIQUE(`username`),
	FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE `authors`(
	`author_id` INT AUTO_INCREMENT PRIMARY KEY,
	`author` VARCHAR(255),
	`date_of_birth` DATE NOT NULL,
	`author_info`, TEXT
	UNIQUE (`author`)
);

CREATE TABLE `genres`( 
	`genre_id` INT AUTO_INCREMENT PRIMARY KEY,
	`genre` VARCHAR(255) NOT NULL,
	UNIQUE(`genre`)
);

CREATE TABLE `songs`(
	`song_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL,
	`author` VARCHAR(255) NOT NULL,
	`genre` INT NOT NULL,
	`duration` VARCHAR(255) NOT NULL,
	`track_position` INT NOT NULL,
	`album_id` int NOT NULL
	FOREIGN KEY (`author`) 
	REFERENCES `authors`(`author_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY(`genre`) REFERENCES `genres`(`genre_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
	FOREIGN KEY(`album_id`) REFERENCES `albums`(`album_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE `albums`(
	`album_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL,
	`author` VARCHAR(255) NOT NULL,
	`genre` INT NOT NULL,
	`duration` VARCHAR(255) NOT NULL,
	`tracks` INT NOT NULL
	`price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
	`picture_path` VARCHAR(255) NOT NULL DEFAULT `https://drive.google.com/file/d/1Wx2jBd67An9CkReaSKEMha-CEIeLiBkS/view?usp=drive_link`
	FOREIGN KEY (`author`) 
	REFERENCES `authors`(`author_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY(`genre`) REFERENCES `genres`(`genre_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
)

CREATE TABLE `product_types`(
	`type_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`type` VARCHAR(255) NOT NULL,
)

CREATE TABLE `products`(
	`product_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`type_id` INT NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
	`description` TEXT NOT NULL,
	`genre` INT NOT NULL,
	`author` INT NOT NULL,
	REFERENCES `authors`(`author_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY(`genre`) REFERENCES `genres`(`genre_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
	FOREIGN KEY(`type_id`) REFERENCES `product_types`(`type_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
)

CREATE TABLE `product_images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `image_path` VARCHAR(500) NOT NULL,
    `product_id` INT NOT NULL
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE
);
