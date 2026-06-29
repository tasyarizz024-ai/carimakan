-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2026 at 04:49 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carimakan`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `icon` varchar(10) NOT NULL DEFAULT '?️',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon`, `created_at`) VALUES
(1, 'Semua', '🍽️', '2026-06-29 06:32:15'),
(2, 'Nasi', '🍚', '2026-06-29 06:32:15'),
(3, 'Mie', '🍜', '2026-06-29 06:32:15'),
(4, 'Sate', '🍢', '2026-06-29 06:32:15'),
(5, 'Ayam', '🍗', '2026-06-29 06:32:15'),
(6, 'Sayur', '🍲', '2026-06-29 06:32:15'),
(7, 'Minuman', '🍹', '2026-06-29 06:32:15');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `menu_id`, `name`) VALUES
(8, 2, 'Mie Kuning'),
(9, 2, 'Udang'),
(10, 2, 'Cumi'),
(11, 2, 'Sawi Hijau'),
(12, 2, 'Kecap Asin'),
(13, 2, 'Bumbu Seafood'),
(14, 3, 'Daging Ayam'),
(15, 3, 'Kacang Tanah'),
(16, 3, 'Kecap Manis'),
(17, 3, 'Cabai Rawit'),
(18, 3, 'Lontong'),
(19, 3, 'Bawang Merah'),
(20, 4, 'Sayuran Rebus'),
(21, 4, 'Tahu'),
(22, 4, 'Tempe'),
(23, 4, 'Telur Rebus'),
(24, 4, 'Bumbu Kacang'),
(25, 4, 'Kerupuk Emping'),
(31, 6, 'Es Serut'),
(32, 6, 'Cincau Hitam'),
(33, 6, 'Kolang Kaling'),
(34, 6, 'Kelapa Muda'),
(35, 6, 'Susu Kental Manis'),
(36, 6, 'Sirup'),
(37, 7, 'Ayam Suwir'),
(38, 7, 'Soun'),
(39, 7, 'Telur Rebus'),
(40, 7, 'Kol'),
(41, 7, 'Koya'),
(42, 7, 'Jeruk Nipis'),
(43, 8, 'Ayam Kampung'),
(44, 8, 'Madu'),
(45, 8, 'Kecap Manis'),
(46, 8, 'Bawang Putih'),
(47, 8, 'Ketumbar'),
(48, 8, 'Lada'),
(49, 9, 'Alpukat'),
(50, 9, 'Susu Kental Manis Cokelat'),
(51, 9, 'Es Batu'),
(52, 9, 'Gula Cair'),
(53, 10, 'Nasi Putih'),
(54, 10, 'Rendang Sapi'),
(55, 10, 'Telur Balado'),
(56, 10, 'Sayur Nangka'),
(57, 10, 'Sambal Hijau'),
(65, 5, 'Ayam Goreng Tepung'),
(66, 5, 'Cabai Rawit Merah'),
(67, 5, 'Bawang Putih'),
(68, 5, 'Garam'),
(69, 5, 'Minyak Panas'),
(70, 11, 'ayam'),
(71, 11, 'nasi'),
(72, 1, 'Nasi Putih'),
(73, 1, 'Telur'),
(74, 1, 'Daging Ayam'),
(75, 1, 'Sosis'),
(76, 1, 'Kecap Manis'),
(77, 1, 'Bawang Merah'),
(78, 1, 'Bawang Putih');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `restaurant` varchar(100) NOT NULL DEFAULT 'Dapur Utama',
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 0.0,
  `reviews` int(11) DEFAULT 0,
  `estimated_time` varchar(20) DEFAULT '15 min',
  `category` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `restaurant`, `description`, `price`, `stock`, `rating`, `reviews`, `estimated_time`, `category`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Nasi Goreng Spesial', 'Dapur Utama', 'Nasi goreng lezat dengan tambahan telur mata sapi, ayam suwir, sosis, dan kerupuk renyah. Disajikan dengan acar segar.', 35000, 49, 4.8, 320, '25 min', 'Nasi', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 14:25:51'),
(2, 'Mie Goreng Seafood', 'Dapur Utama', 'Mie goreng gurih dengan topping udang, cumi, bakso ikan, dan sayuran segar.', 45000, 30, 4.7, 415, '15 min', 'Mie', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 06:32:15'),
(3, 'Sate Ayam Madura', 'Dapur Utama', 'Sate ayam empuk dipanggang sempurna dengan bumbu kacang khas yang kental dan gurih, disajikan dengan lontong.', 40000, 100, 4.9, 890, '20 min', 'Sate', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 13:24:43'),
(4, 'Gado-Gado Betawi', 'Dapur Utama', 'Salad sayur tradisional Indonesia dengan bumbu kacang lezat, tempe, tahu, telur rebus, dan kerupuk emping.', 25000, 20, 4.6, 210, '10 min', 'Sayur', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 06:32:15'),
(5, 'Ayam Geprek Sambal Korek', 'Dapur Utama', 'Ayam goreng tepung renyah yang digeprek hancur dengan sambal korek super pedas. Bikin nagih!', 28000, 100, 4.8, 1250, '15 min', 'Ayam', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 12:01:28'),
(6, 'Es Campur Segar', 'Dapur Utama', 'Minuman es pelepas dahaga dengan campuran cincau, kolang-kaling, kelapa muda, nangka, dan susu kental manis.', 20000, 50, 4.7, 530, '5 min', 'Minuman', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 12:39:56'),
(7, 'Soto Ayam Lamongan', 'Dapur Utama', 'Soto ayam dengan kuah kuning yang segar, ditaburi koya khas Lamongan yang bikin kuah makin gurih.', 30000, 25, 4.8, 740, '10 min', 'Sayur', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 06:32:15'),
(8, 'Ayam Bakar Madu', 'Dapur Utama', 'Ayam bakar pilihan dengan olesan madu manis gurih meresap sampai ke dalam daging.', 35000, 30, 4.9, 620, '20 min', 'Ayam', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 06:32:15'),
(9, 'Jus Alpukat', 'Dapur Utama', 'Jus alpukat segar dan kental dengan tambahan susu kental manis cokelat dan taburan meses.', 18000, 45, 4.6, 310, '5 min', 'Minuman', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 06:32:15'),
(10, 'Nasi Rames Nusantara', 'Dapur Utama', 'Nasi putih hangat dipadu dengan rendang sapi, telur balado, sayur nangka, dan sambal hijau.', 32000, 35, 4.7, 580, '10 min', 'Nasi', NULL, 1, '2026-06-29 06:32:15', '2026-06-29 06:32:15'),
(11, 'polinela', 'Dapur Utama', 'i love', 55000, 50, 0.0, 0, '15 min', 'Nasi', 'menu_1782734562894.png', 0, '2026-06-29 12:02:42', '2026-06-29 12:04:14');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(20) NOT NULL,
  `table_number` varchar(20) NOT NULL DEFAULT 'Meja 01',
  `total` int(11) NOT NULL DEFAULT 0,
  `discount` int(11) DEFAULT 0,
  `tax` int(11) DEFAULT 0,
  `promo_code` varchar(20) DEFAULT NULL,
  `status` enum('pending','cooking','served') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `menu_name` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `subtotal` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `registration_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `name`, `created_at`, `registration_token`) VALUES
(1, 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrator', '2026-06-29 06:32:15', 'ADMIN2026'),
(2, 'pelanggan', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Pelanggan', '2026-06-29 06:32:15', NULL),
(3, 'tasya', '$2b$10$3EhCHeEf52OlH80DcssEC.jdxyJ/uDALkuBXmDMijKfQTX3DuAApK', 'admin', 'tasya', '2026-06-29 13:48:14', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
