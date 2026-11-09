-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `admin_users` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(1024) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
