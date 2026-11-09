-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `orders_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `ticket_code` varchar(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ticket_code` (`ticket_code`),
  KEY `order_fk_idx` (`order_id`),
  KEY `produck_fk_idx` (`product_id`),
  CONSTRAINT `order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders_id` (`order_id`),
  CONSTRAINT `produck_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
