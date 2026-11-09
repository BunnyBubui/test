-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `admin_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `token` text NOT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `login_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `logout_time` datetime DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fg_admin_id_idx` (`admin_id`),
  CONSTRAINT `fg_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`admin_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
