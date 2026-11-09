-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `sport_id` int NOT NULL,
  `location_name` varchar(255) NOT NULL,
  PRIMARY KEY (`location_id`),
  KEY `fk_sport_id_idx` (`sport_id`),
  CONSTRAINT `fk_sport_id` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
