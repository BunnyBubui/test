-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `categories` (
  `categories_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  PRIMARY KEY (`categories_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `sport_id` int NOT NULL,
  `location_name` varchar(255) NOT NULL,
  PRIMARY KEY (`location_id`),
  KEY `fk_sport_id_idx` (`sport_id`),
  CONSTRAINT `fk_sport_id` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `match_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `team_id` int NOT NULL,
  `result` enum('win','lose','draw') NOT NULL,
  `record_datetime` datetime NOT NULL,
  PRIMARY KEY (`result_id`),
  KEY `match_id_idx` (`match_id`),
  KEY `rt_team_id_idx` (`team_id`),
  CONSTRAINT `rt_match_id` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`),
  CONSTRAINT `rt_team_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `matches` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `sport_id` int NOT NULL,
  `category_id` int NOT NULL,
  `location_id` int NOT NULL,
  `match_date` date NOT NULL,
  `match_time` time NOT NULL,
  `round_name` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`match_id`),
  KEY `sport_id_idx` (`sport_id`),
  KEY `category_id_idx` (`category_id`),
  KEY `location_id_idx` (`location_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`categories_id`),
  CONSTRAINT `location_id` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `sport_id` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `medal_records` (
  `medals_id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `match_id` int NOT NULL,
  `medal` enum('gold','silver','bronze') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`medals_id`),
  KEY `medals_team_id_idx` (`team_id`),
  KEY `medal_match_id_idx` (`match_id`),
  CONSTRAINT `medales_match_id` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`),
  CONSTRAINT `medals_team_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sports` (
  `sport_id` int NOT NULL AUTO_INCREMENT,
  `sport_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
