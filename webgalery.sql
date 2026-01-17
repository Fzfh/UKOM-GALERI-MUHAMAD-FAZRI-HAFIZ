-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 09:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webgalery`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `data_galery_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `data_galery_id`, `user_name`, `comment_text`, `created_at`) VALUES
(11, 34, 'fazri', 'apaan kocak ini parfum manis', '2025-11-30 14:53:44'),
(12, 32, 'user', 'parfum guee ini pak', '2025-11-30 15:59:36'),
(13, 37, 'fazri', 'asu', '2025-12-01 00:30:35'),
(14, 38, 'Panca', 'INI LAH KINGGGGG', '2025-12-01 02:43:01'),
(15, 34, 'Panca', 'BEUHHHHH', '2025-12-01 02:43:13'),
(16, 32, 'Panca', 'when yah gw', '2025-12-01 02:43:34'),
(17, 52, 'user', 'njir', '2025-12-01 07:58:13'),
(18, 43, 'fazri', 'test\n', '2025-12-01 08:13:17'),
(19, 43, 'fazri', 'test\n', '2025-12-01 08:13:20'),
(20, 43, 'fazri', 'teste', '2025-12-01 08:13:22'),
(21, 43, 'fazri', 'test', '2025-12-01 08:13:24'),
(22, 43, 'fazri', 'test', '2025-12-01 08:13:32'),
(23, 43, 'fazri', 'test', '2025-12-01 08:13:37');

-- --------------------------------------------------------

--
-- Table structure for table `data_galery`
--

CREATE TABLE `data_galery` (
  `id` int(11) NOT NULL,
  `galery_id` int(11) DEFAULT NULL,
  `file` varchar(500) NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_galery`
--

INSERT INTO `data_galery` (`id`, `galery_id`, `file`, `judul`, `deskripsi`, `created_at`) VALUES
(32, 6, '/uploads/images/1764511465587-30882215.jpeg', 'Dior Sauvage', 'Parfume Fresh Manis Tipe Pria', '2025-11-30 14:04:25'),
(33, 6, '/uploads/images/1764511706337-129842966.jpeg', 'Versace Eros', 'Parfum pria elegan dengan harum manis namun juga fresh. Cocok siang hari.', '2025-11-30 14:08:26'),
(34, 9, '/uploads/images/1764514167618-407682932.jpeg', 'HMNS Alpha', 'Parfume Fresh Pria Dengan Wangi Citrus', '2025-11-30 14:49:27'),
(35, 4, '/uploads/images/1764514587626-131866027.jpeg', 'Jean Paul GAULTIER Le Male', 'Parfum Pria Manis Untuk Malam Hari', '2025-11-30 14:56:27'),
(36, 5, '/uploads/images/1764514764317-504726623.jpeg', 'LE BEAU LE PARFUM EAU DE PARFUM INTENSE Jean Paul Gaultier', 'A call for the senses to rebel... Le Beau Le Parfum opens the gates to Jean Paul Gaultier\'s luxuriant garden. Revealing his most intense nature, the first man certainly knows how to wield his natural power of attraction. ', '2025-11-30 14:59:24'),
(37, 7, '/uploads/images/1764516257582-95595684.jpg', 'Afnan 9PM Rebel', 'Parfum Manis Nanas, adek adekan king supremacy NIHHH', '2025-11-30 15:24:17'),
(38, 7, '/uploads/images/1764518016331-502836837.jpg', 'Afnan Supremacy Collector Edition', 'PARFUM NANAS LIMITEED TEERR ENAKK, KIIINGGG!!!', '2025-11-30 15:53:36'),
(39, 8, '/uploads/images/1764521907630-343830290.jpeg', 'MyKonos California Blue', 'Parfum fresh Lokal Bagus Sih Ini', '2025-11-30 16:58:27'),
(40, 7, '/uploads/images/1764557783429-156907563.jpeg', 'Afnan 9PM', 'Parfum Manis Untuk Malam Hari', '2025-12-01 02:56:23'),
(41, 8, '/uploads/images/1764565413249-323964259.jpeg', 'HMNS Forhamption', 'Parfum Fresh untuk siang hari', '2025-12-01 05:03:33'),
(42, 5, '/uploads/images/1764565546685-907500702.jpeg', 'Versace Eros Flame', 'Parfum fresh kasta tinggi', '2025-12-01 05:05:46'),
(43, 9, '/uploads/images/1764565975031-108718351.jpeg', 'Velixir Orion', 'Orion is for those who speak confidence and charm—commanding yet approachable. Perfect for casual nights or soirées, leaving a lasting impression.\n\n', '2025-12-01 05:12:55'),
(44, 8, '/uploads/images/1764566672528-806004553.jpeg', 'Velixir Helios', 'Parfum fresh menengah dengan wangi kelapa', '2025-12-01 05:24:32'),
(45, 8, '/uploads/images/1764566746077-27684429.webp', 'Aoera Royale', 'Parfum lokal fresh buah', '2025-12-01 05:25:46'),
(46, 5, '/uploads/images/1764566834490-297653499.jpeg', 'y eau de parfum ysl', 'KING', '2025-12-01 05:27:14'),
(47, 6, '/uploads/images/1764566920491-306524518.jpeg', 'Libre Le Parfum by Yves Saint Laurent', 'beuhh', '2025-12-01 05:28:40'),
(48, 5, '/uploads/images/1764566991516-246751099.jpeg', 'Le Male Le Parfum Eau de Parfum Intense by Jean Paul Gaultier', 'Gorgeous ingredients and statement opulence for unbridled sensuality with Scandal Absolu.\n\nWhat is this intense Scandal fragrance setting Jean Paul Gaultier nights ablaze? Rumour has it the Scandal in question is outrageously liberated, mysteriously charismatic and completely rebellious. Some say that its woody notes are so sensual that you\'ll never want to sleep again!', '2025-12-01 05:29:51'),
(49, 8, '/uploads/images/1764567997998-168964190.jpeg', 'Bali Surfers Blue Point For Him', 'Parfum fresh dengan citrus serasa di pantai', '2025-12-01 05:46:38'),
(50, 8, '/uploads/images/1764568169438-579551280.jpeg', 'Bali Surfers Blue Point For Her', 'Parfume fresh pantai untuk her (cewe)', '2025-12-01 05:49:29'),
(51, 4, '/uploads/images/1764575759774-842578606.jpeg', 'Yves Saint Laurent Mon Paris Eau de Parfum', 'Parfum tipe perempuan dengan aroma manis elegan', '2025-12-01 07:55:59'),
(52, 4, '/uploads/images/1764575839480-861284338.jpeg', 'Carolina Herrera Bad Boy Extreme EDP', 'parfum manis', '2025-12-01 07:57:19'),
(53, 10, '/uploads/images/1764576143833-548958722.webp', 'Velixir Galatea', 'Effortlessly warm and inviting, with a touch of sophistication—perfect for those who embrace pleasure fully and leave a lasting presence.', '2025-12-01 08:02:23'),
(54, 8, '/uploads/images/1764576264997-480430742.webp', 'Velixir Demeter', 'Demeter speaks the language of quiet authority—cool, precise, and irresistibly refined. Fresh mint and radiant citrus cut through with striking clarity, embodying a fragrance that commands attention without raising its voice.\r\n\r\n', '2025-12-01 08:04:25'),
(55, 9, '/uploads/images/1764576658851-451947036.webp', 'Velixir Adonis', 'Adonis is for the man who exudes effortless masculinity. Sweet yet undeniably bold, it is crafted for nights that captivate and moments that leave an unforgettable impression.\r\n\r\n', '2025-12-01 08:10:58'),
(56, 8, '/uploads/images/1764576890945-146874687.webp', 'Velixir Apollo', 'Radiant and unstoppable—crafted for those who charge forward with joy, spark momentum with every step, and light up the world simply by moving through it.\r\n\r\n', '2025-12-01 08:14:50'),
(57, 9, '/uploads/images/1764576979300-559707147.webp', 'Velixir Narcisus', 'From sunlit terraces to midnight whispers, Helios embodies quiet confidence, carrying the warmth of a tropical breeze wherever you go.\r\n\r\n', '2025-12-01 08:16:19'),
(58, 10, '/uploads/images/1764577081028-645372041.webp', 'Velixir Athena', 'Soft laughter, gentle embraces—Athena lingers from the skin to the heart.\r\n\r\n', '2025-12-01 08:18:01'),
(59, 10, '/uploads/images/1764577259284-3629466.webp', 'Velixir Icarus', 'Icarus is for dreamers who rise with quiet strength, glowing from within and leaving a trail of light and elegance in their wake. Fresh, vibrant, and irresistibly magnetic—it’s a fragrance of fearless elegance that turns heads everywhere\r\n\r\n', '2025-12-01 08:20:59'),
(60, 4, '/uploads/images/1764577842168-867626962.avif', 'Le Belle Jean Paul Gaultier', 'La Belle is as provocative as she is captivating. The juicy apricot note immediately reveals its exquisite uniqueness. Magnolia, jasmine and osmanthus absolutes create a voluptuous bouquet that stirs desire. A little, a lot, passionately...her charm works on every level... To perfect this game of seduction, lush vanilla underlined by patchouli casts its irresistible spell.', '2025-12-01 08:30:42'),
(61, 4, '/uploads/images/1764578673442-153066076.avif', 'Scandal Jean Paul Gaultier', 'Far from intimidated by the global success of their predecessors, the legendary Classique and Le Male, Scandal defiantly takes its place among the iconic fragrances by the House of Gaultier. Ask her if she thinks she can do anything and Scandal will answer in a honeyed voice: Yes. You only need look at the bottle to realise that this fragrance is unshrinking, legs literally in the air! And with that attitude, Scandal is never far behind: Scandal le Parfum, Scandal Gold, So Scandal!… An entire collection of gourmand and thrilling sensations. Tonight, Scandal will be on everyone’s lips for sure!', '2025-12-01 08:44:33'),
(62, 4, '/uploads/images/1764578856069-62898864.avif', 'Floral Gourmand Marine', 'A balancing act between floral and gourmand notes, interspersed with a salty vibe. Majestic and luminous, this spectacular lily à la Gaultier unfurls its voluptuousness in a bouquet of white flowers, while an airy meringue adds delicious sweetness. Unbelievably irresistible!\r\n', '2025-12-01 08:47:36');

-- --------------------------------------------------------

--
-- Table structure for table `galery`
--

CREATE TABLE `galery` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `position` int(11) DEFAULT 0,
  `status` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `galery`
--

INSERT INTO `galery` (`id`, `title`, `description`, `cover_image`, `post_id`, `position`, `status`, `created_at`) VALUES
(3, 'apa aja', 'apa aja', 'uploads/cover_692824dfc630c.png', NULL, 1, 1, '2025-11-27 10:15:59'),
(4, 'Gallery for post 1', NULL, NULL, 1, 0, 0, '2025-11-30 07:13:07'),
(5, 'Gallery for post 2', NULL, NULL, 2, 0, 0, '2025-11-30 07:14:19'),
(6, 'Gallery for post 3', NULL, NULL, 3, 0, 0, '2025-11-30 10:39:39'),
(7, 'Gallery for post 4', NULL, NULL, 4, 0, 1, '2025-11-30 15:49:47'),
(8, 'Gallery for post 5', NULL, NULL, 5, 0, 1, '2025-12-01 05:11:21'),
(9, 'Gallery for post 6', NULL, NULL, 6, 0, 0, '2025-12-01 05:12:55'),
(10, 'Gallery for post 7', NULL, NULL, 7, 0, 1, '2025-12-01 08:16:43');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `judul`, `created_at`) VALUES
(1, 'Parfume Fresh - Flagship', '2025-11-17 13:08:20'),
(2, 'Parfume Sweet - Flagship', '2025-11-17 13:08:20'),
(3, 'Parfume Versatile - Flagship', '2025-11-17 13:08:20'),
(4, 'Parfume Timur Tengah', '2025-11-30 14:46:37'),
(5, 'Parfume Fresh - MidRange', '2025-12-01 05:10:41'),
(6, 'Parfume Sweet - MidRange', '2025-12-01 05:10:52'),
(7, 'Parfume Versatile - MidRange', '2025-12-01 05:11:04');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `data_galery_id` int(11) DEFAULT NULL,
  `user_ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `data_galery_id`, `user_ip`, `created_at`) VALUES
(27, 34, 'fazri', '2025-11-30 14:53:36'),
(28, 32, 'user', '2025-11-30 15:59:30'),
(33, 32, 'Panca', '2025-12-01 02:43:28'),
(34, 38, 'fazri', '2025-12-01 02:56:34'),
(35, 32, 'fazri', '2025-12-01 02:57:06'),
(36, 52, 'user', '2025-12-01 07:58:09'),
(37, 47, 'user', '2025-12-01 07:58:33');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `kategori_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `judul`, `kategori_id`, `status`, `created_at`) VALUES
(1, 'Post for category 2', 2, 'active', '2025-11-30 07:13:07'),
(2, 'Post for category 1', 1, 'active', '2025-11-30 07:14:19'),
(3, 'Post for category 3', 3, 'active', '2025-11-30 10:39:39'),
(4, 'Post for category 4', 4, 'draft', '2025-11-30 15:49:47'),
(5, 'Post for category 5', 5, 'draft', '2025-12-01 05:11:21'),
(6, 'Post for category 6', 6, 'active', '2025-12-01 05:12:55'),
(7, 'Post for category 7', 7, 'draft', '2025-12-01 08:16:43');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('administrator','guest') DEFAULT 'guest',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`) VALUES
(2, 'admin2', 'admin456', 'admin@sekolahan.sch.id', 'administrator', '2025-11-18 17:51:10'),
(3, 'fazri', '$2b$10$Up9KmiZvUB1vljVCo9mO4OEeBG0NDxXau3TpcrVSe7SZJmu5Gb7tG', 'fazri@gmail.com', 'administrator', '2025-11-30 07:11:07'),
(4, 'user', '$2b$10$C.rsM2M/3gcwv2kWFJLN7uVoYh3mJl9HwN5007rHqgIxpy7WagxsS', 'user@gmail.com', '', '2025-11-30 07:46:15'),
(5, 'Panca', '$2b$10$YY5.Ori7GCVJtCDd2cViLerl4PJjabbnYf7N.WOYZcIqvGAGng/A.', 'panca@gmail.com', '', '2025-12-01 02:42:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `data_galery_id` (`data_galery_id`);

--
-- Indexes for table `data_galery`
--
ALTER TABLE `data_galery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `galery_id` (`galery_id`);

--
-- Indexes for table `galery`
--
ALTER TABLE `galery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`data_galery_id`,`user_ip`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategori_id` (`kategori_id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `data_galery`
--
ALTER TABLE `data_galery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `galery`
--
ALTER TABLE `galery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`data_galery_id`) REFERENCES `data_galery` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `data_galery`
--
ALTER TABLE `data_galery`
  ADD CONSTRAINT `data_galery_ibfk_1` FOREIGN KEY (`galery_id`) REFERENCES `galery` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `galery`
--
ALTER TABLE `galery`
  ADD CONSTRAINT `galery_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`data_galery_id`) REFERENCES `data_galery` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
