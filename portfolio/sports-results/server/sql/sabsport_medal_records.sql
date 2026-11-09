-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
