-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

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

SET FOREIGN_KEY_CHECKS=1;
