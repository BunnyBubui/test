-- Schema only. No user, credential, session, order or payment records.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `pictures_path` text NOT NULL,
  `type` enum('N','P','S') NOT NULL DEFAULT 'N',
  `promo_count` int NOT NULL DEFAULT '1',
  `price` int NOT NULL,
  `price_piece` int NOT NULL,
  `quantity` int NOT NULL,
  `preorder` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`product_id`),
  KEY `fg_shop_id_idx` (`shop_id`),
  CONSTRAINT `fg_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
