CREATE DATABASE `webstore`;
USE `webstore`;

CREATE TABLE `users`(
	`usename_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`username` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`balance` DOUBLE(10,2) NOT NULL DEFAULT 0.0,
	`subscription` BOOL DEFAULT FALSE,
	`profile_picture_url` VARCHAR(255) NOT NULL DEFAULT 'https://imgur.com/a/el5idNE',
	UNIQUE (`username`)
);

CREATE TABLE `bought_product_information`(
	`usename_id` INT AUTO_INCREMENT PRIMARY KEY,
	`username` VARCHAR(255),
	`products` TEXT,
	UNIQUE(`username`),
	FOREIGN KEY(`username`) REFERENCES `users`(`username`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE `music_authors`(
	`author_id` INT AUTO_INCREMENT PRIMARY KEY,
	`author` VARCHAR(255),
	UNIQUE (`author`)
);

CREATE TABLE `type_music`(
	`type_id` INT AUTO_INCREMENT PRIMARY KEY,
	`music_type` VARCHAR(255) NOT NULL,
	UNIQUE(`music_type`)
);

CREATE TABLE `music`(
	`music_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL,
	`author` VARCHAR(255),
	`price` DOUBLE(10,2) NOT NULL DEFAULT 0.00,
	`short_info` VARCHAR(255) NOT NULL,
	`type` VARCHAR(255),
	`music_picture_url` VARCHAR(255) NOT NULL DEFAULT 'https://drive.google.com/file/d/1Wx2jBd67An9CkReaSKEMha-CEIeLiBkS/view?usp=drive_link',
	FOREIGN KEY (`author`) 
	REFERENCES `music_authors`(`author`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY(`type`) REFERENCES `type_music`(`music_type`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

