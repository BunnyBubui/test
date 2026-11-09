-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `orders_id` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `user_id` varchar(45) NOT NULL,
  `card_number` varchar(13) DEFAULT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `phone` varchar(10) NOT NULL,
  `total_price` int NOT NULL,
  `slip_path` varchar(255) DEFAULT NULL,
  `received` tinyint DEFAULT '0',
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `shop_id_idx` (`shop_id`),
  CONSTRAINT `shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
