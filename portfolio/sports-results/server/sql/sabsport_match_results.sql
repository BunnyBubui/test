-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `match_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `team_id` int NOT NULL,
  `result` enum('win','lose','draw') NOT NULL,
  `record_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  KEY `match_id_idx` (`match_id`),
  KEY `rt_team_id_idx` (`team_id`),
  CONSTRAINT `rt_match_id` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`),
  CONSTRAINT `rt_team_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
