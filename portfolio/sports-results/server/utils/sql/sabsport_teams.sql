-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` text NOT NULL,
  `team_color` varchar(45) NOT NULL,
  `team_color_code` varchar(10) NOT NULL,
  `team_picture_path` varchar(255) NOT NULL,
  `team_link_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
