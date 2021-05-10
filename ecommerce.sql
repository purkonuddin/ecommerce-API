-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Sep 2020 pada 12.28
-- Versi server: 10.4.14-MariaDB
-- Versi PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_cart`
--

 
-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_categories`
--

CREATE TABLE `ecommerce`.`tb_categories` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `category_id` varchar(255) DEFAULT NULL,
  `category_name` varchar(60) DEFAULT NULL,
  `category_image` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NULL,
  UNIQUE KEY `idx_category_id` (`category_id`),
  UNIQUE KEY `idx_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 

--
-- Dumping data untuk tabel `tb_categories`
--

INSERT INTO `tb_categories` (`id`, `category_id`, `category_name`, `category_image`, `created_at`, `updated_at`) VALUES
(1, 'd6a802d7-5ca5-4538-a479-0e37092f5b9c', 't-shirt', ' http://localhost:8080/imgs-category/ctgry-icin-4-200x200.png', '2020-09-27', '2020-09-27'),
(2, '148d657d-e648-4bd9-a710-cbe072e6f2c9', 'shirt', ' http://localhost:8080/imgs-category/ctgry-icin-3-200x200.png', '2020-09-27', '2020-09-27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_customer_address`
--

CREATE TABLE `ecommerce`.`tb_customer_address` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  `customer_id` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `primary_address` enum('true','false') NOT NULL DEFAULT 'false',
  `city_id` int(255) DEFAULT NULL,
  `province_id` int(255) DEFAULT NULL,
  `city_name` varchar(255) NOT NULL,
  `province_name` varchar(255) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `recipient_phone_number` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;tb_user

--
-- Dumping data untuk tabel `tb_customer_address`
--

INSERT INTO `tb_customer_address` (`id`, `customer_id`, `address`, `primary_address`) VALUES
(1, '844a3945-314b-4385-932c-e57e30f8abfa', 'address', 'false'),
(2, '844a3945-314b-4385-932c-e57e30f8abfa', 'address', 'true'),
(3, '844a3945-314b-4385-932c-e57e30f8abfa', 'address 3', 'false'),
(4, '7d322a82-9b7b-4457-bc15-547f870327aa', 'kp. gelap gulita rt.01 rw.01, desa hujan', 'true');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_orders`
--

CREATE TABLE `ecommerce`.`tb_orders` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `expire_date` datetime DEFAULT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `shiping_price` int DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `ppn` varchar(15) NOT NULL,
  `payment_total` float DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `shiping_courir` varchar(255) DEFAULT NULL,
  `shiping_city` varchar(255) DEFAULT NULL,
  `shiping_address` varchar(255) DEFAULT NULL,
  `sts_order` enum('diterima','dikirim','diproses','selesai','batal','menunggu') NOT NULL,
  `sts_payment` enum('lunas','menungu','diproses') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_orders`
--

INSERT INTO `tb_orders` (`id`, `order_number`, `order_date`, `expire_date`, `customer_id`, `customer_name`, `total_price`, `shiping_price`, `discount`, `ppn`, `payment_total`, `payment_type`, `shiping_courir`, `shiping_city`, `shiping_address`, `sts_order`, `sts_payment`) VALUES
(39, '7d322a82-9b7b-4457-bc15-547f870327aa-1601373897274', '2020-09-23 21:37:35', '2020-09-25 21:37:35', '7d322a82-9b7b-4457-bc15-547f870327aa', 'purkonuddin', 594550, 1000, 0, '0%', 5.94551e15, 'cash', 'POS', 'Papua', 'jl.cendrawasih no. 99 Rt.01 Rw.01, Kel/Desa ASDF, Kec. QWERTY', 'menunggu', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_order_detail`
--

CREATE TABLE `ecommerce`.`tb_order_detail` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `member_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `seller` varchar(255) NOT NULL,
  `product_condition` varchar(255) NOT NULL,
  `product_size` varchar(255) NOT NULL,
  `product_color` varchar(255) NOT NULL,
  `qty` int NOT NULL,
  `price` float NOT NULL,
  `disc` float NOT NULL,
  `price_aft_disc` float NOT NULL,
  `subtotal` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_order_detail`
--

INSERT INTO `tb_order_detail` (`id`, `order_number`, `member_id`, `product_id`, `product_name`, `category`, `seller`, `product_condition`, `product_size`, `product_color`, `qty`, `price`, `disc`, `price_aft_disc`, `subtotal`) VALUES
(55, '7d322a82-9b7b-4457-bc15-547f870327aa-1601373897274', '7d322a82-9b7b-4457-bc15-547f870327aa', '1601366131281', 'celana 1', 'celana', 'Toko ABC', 'baru', 'XL', 'White', 5, 102000, 0, 102000, 510000),
(56, '7d322a82-9b7b-4457-bc15-547f870327aa-1601373897274', '7d322a82-9b7b-4457-bc15-547f870327aa', '1600846319164', 'spicy pasta', 'pasta', 'toko ABC', 'baru', 'XL', 'White', 1, 89000, 0.05, 84550, 84550);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_products`
--

CREATE TABLE `ecommerce`.`tb_products` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_description` text DEFAULT NULL,
  `product_image` text DEFAULT NULL,
  `product_category` varchar(255) DEFAULT NULL,
  `product_price` int DEFAULT NULL,
  `disc` float DEFAULT 0,
  `price_aft_disc` float DEFAULT 0,
  `product_stock` int DEFAULT NULL,
  `seller` varchar(255) DEFAULT NULL,
  `product_rating` int DEFAULT NULL,
  `product_condition` varchar(255) DEFAULT NULL,
  `product_size` varchar(255) DEFAULT NULL,
  `product_color` varchar(255) DEFAULT NULL,
  `added_at` datetime NOT NULL,
  `updated_at` datetime,
  UNIQUE KEY `idx_product_id` (`product_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_products`
--

INSERT INTO `tb_products` (`id`, `product_id`, `product_name`, `product_description`, `product_image`, `product_category`, `product_price`, `disc`, `price_aft_disc`, `product_stock`, `seller`, `product_rating`, `product_condition`, `product_size`, `product_color`, `added_at`, `updated_at`) VALUES
(80, '1600846319164', 'spicy pasta', 'product_description', 'http://localhost:8080/imgs-products/1601261370225-seller-2-200x200.png, http://localhost:8080/imgs-products/1601261370225-seller-3-200x200.png, http://localhost:8080/imgs-products/1601261370225-seller-4-200x200.png, http://localhost:8080/imgs-products/1601261370225-seller-5-200x200.png, http://localhost:8080/imgs-products/1601261370225-seller-7-200x200.png', 'pasta', 89000, 0.05, 84550, 33, 'toko ABC', 5, 'baru', 'XL, M, S, L', 'Red, Green, Navy, White', '2020-09-28 09:49:30', NULL),
(81, '1601362127057', 'pakaian ', 'product_description', 'http://localhost:8001/imgs-products/1601362127057-neapolitandream.png, http://localhost:8001/imgs-products/1601362127057-orientalchickenspaggehti.png, http://localhost:8001/imgs-products/1601362127057-pasta-1-300x300.png, http://localhost:8001/imgs-products/1601362127057-pasta-2-300x300.png, http://localhost:8001/imgs-products/1601362127057-potatoweges.png', 't-shirt', 89000, 0.05, 84550, 50, 'Toko ABC', 0, 'baru', 'XL, M, S, L', 'Red, Green, Navy, White', '2020-09-29 13:48:47', NULL),
(82, '1601366131281', 'celana 1', 'product_description celana 1', 'http://localhost:8001/imgs-products/1601366131281-menu-1-120x120.jpg, http://localhost:8001/imgs-products/1601366131281-menu-2-120x120.jpg, http://localhost:8001/imgs-products/1601366131281-menu-3-120x120.jpg, http://localhost:8001/imgs-products/1601366131281-menu-4-120x120.jpg, http://localhost:8001/imgs-products/1601366131281-menu-5-120x120.jpg', 'celana', 102000, 0, 102000, 45, 'Toko ABC', 0, 'baru', 'XL, M, S, L', 'Red, Green, Navy, White', '2020-09-29 14:55:31', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_slide`
--

CREATE TABLE `ecommerce`.`tb_slide` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `slide_id` varchar(255) NOT NULL,
  `slide_name` varchar(255) NOT NULL,
  `slide_image` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `aktif` enum('0','1') NOT NULL DEFAULT '1',
  UNIQUE KEY `idx_slide_name` (`slide_name`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_slide`
--

INSERT INTO `tb_slide` (`id`, `slide_id`, `slide_name`, `slide_image`, `url`, `aktif`) VALUES
(1, 'cf4b0f1c-9b2c-438f-8853-609863764fdb', 'Black Series', 'http://localhost:8001/imgs-slide/slide-1601279829549-footer_1600x800.jpg', 'http://localhost:8001/api/slide', '1');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `ecommerce`.`tb_user` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  `gender` enum('laki-laki','perempuan') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `primary_address` varchar(255) DEFAULT NULL,
  `second_address` varchar(255) DEFAULT NULL,
  `user_store` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `registered_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `email_verify_token` varchar(255) DEFAULT NULL,
  `email_verified` enum('0','1') NOT NULL,
  `account_type` enum('seller','customer','admin') NOT NULL,
  UNIQUE KEY `idx_user_id` (`user_id`),
  UNIQUE KEY `idx_user_id` (`user_email`),
  UNIQUE KEY `idx_user_id` (`user_phone`),
  UNIQUE KEY `idx_user_id` (`user_store`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `tb_user`
--

INSERT INTO `tb_user` (`id`, `user_id`, `user_name`, `user_email`, `user_phone`, `gender`, `date_of_birth`, `primary_address`, `second_address`, `user_store`, `user_password`, `registered_at`, `last_login`, `user_image`, `email_verify_token`, `email_verified`, `account_type`) VALUES
(27, '7d322a82-9b7b-4457-bc15-547f870327aa', 'purkonuddin', 'purkonud2508@bsi.ac.id', '085779919112', 'laki-laki', '2020-09-28', NULL, NULL, 'null', '$2b$10$su1EJ9BnOMUP/pJtf9vRT.0lcQ2YR.qrM8N7WMEaHTWuu3OQOrxv2', '2020-09-29 11:46:04', '2020-09-29 12:28:39', 'http://localhost:8001/imgs-users/7d322a82-9b7b-4457-bc15-547f870327aa-purkonuddin-.jpeg', '402a01c88fb321b5fd5e431718df6510f3dac075', '1', 'customer'),
(28, 'eee8d94f-0091-4ae3-8fdb-acc2b177fa3f', 'Mr Corona', 'purkonud12119617@gmail.com', '099779919112', 'laki-laki', '2020-09-29', NULL, NULL, 'Toko ABC', '$2b$10$o29VbOYOe0ji3NgD6IWHQOXpoHQFfCbsRyAHhBiPXXoOZU7R.V1N2', '2020-09-29 13:32:34', '2020-09-29 13:34:02', NULL, 'a5fd65b14dad558830eedc31a2e5807c550e7e29', '1', 'seller');

COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
