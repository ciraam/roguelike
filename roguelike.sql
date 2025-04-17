-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 17 avr. 2025 à 23:39
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `roguelike`
--

-- --------------------------------------------------------

--
-- Structure de la table `score`
--

CREATE TABLE `score` (
  `score_id` int(11) NOT NULL,
  `score_user_id` int(11) DEFAULT NULL,
  `score_score` int(11) NOT NULL,
  `score_level_player` int(11) DEFAULT NULL,
  `score_level_stage` int(11) DEFAULT NULL,
  `score_kill` int(11) DEFAULT NULL,
  `score_time` time DEFAULT NULL,
  `score_createtime` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `score`
--

INSERT INTO `score` (`score_id`, `score_user_id`, `score_score`, `score_level_player`, `score_level_stage`, `score_kill`, `score_time`, `score_createtime`) VALUES
(71, 35, 0, 1, 0, 0, '00:00:00', '2025-04-17 05:48:25'),
(72, 35, 0, 1, 0, 0, '00:00:00', '2025-04-17 05:49:22'),
(73, 35, 0, 1, 1, 1, '00:00:18', '2025-04-17 05:53:25'),
(74, 35, 0, 1, 1, 1, '00:00:16', '2025-04-17 05:56:28'),
(75, 35, 0, 1, 1, 1, '00:00:17', '2025-04-17 05:58:35'),
(76, 35, 0, 1, 1, 1, '00:00:15', '2025-04-17 05:59:50'),
(77, 35, 0, 1, 1, 1, '00:00:17', '2025-04-17 06:03:12'),
(78, 35, 0, 1, 1, 1, '00:00:09', '2025-04-17 06:06:59'),
(79, 35, 0, 1, 1, 1, '00:00:14', '2025-04-17 06:09:11');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_pseudo` text NOT NULL,
  `user_bestscore` int(11) DEFAULT 0,
  `user_count_death` int(11) DEFAULT 0,
  `user_last_game` datetime DEFAULT NULL,
  `user_createtime` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`user_id`, `user_pseudo`, `user_bestscore`, `user_count_death`, `user_last_game`, `user_createtime`) VALUES
(1, 'test', 0, 0, NULL, '2025-03-28 03:20:45'),
(2, 'test1', 0, 0, NULL, '2025-03-28 03:21:12'),
(3, 'test2', 0, 0, NULL, '2025-03-28 03:22:31'),
(4, 'test3', 0, 0, NULL, '2025-03-28 03:22:41'),
(5, 'test4', 0, 0, NULL, '2025-03-28 03:24:16'),
(6, 'test6', 0, 0, NULL, '2025-03-28 03:26:23'),
(7, 'tes', 0, 0, NULL, '2025-03-28 03:26:57'),
(8, 'te', 0, 0, NULL, '2025-03-28 03:29:25'),
(9, 'te1', 0, 0, NULL, '2025-03-28 03:30:13'),
(10, 'te2', 0, 0, NULL, '2025-03-28 03:30:49'),
(11, 'te3', 0, 0, NULL, '2025-03-28 03:34:09'),
(12, 'te4', 0, 0, NULL, '2025-03-28 03:35:07'),
(13, 'te5', 0, 0, NULL, '2025-03-28 03:36:43'),
(14, 't1', 0, 0, NULL, '2025-03-28 03:41:05'),
(15, 'tes7', 0, 0, NULL, '2025-03-28 03:43:23'),
(16, 'offi', 0, 0, NULL, '2025-03-28 03:45:07'),
(17, 'user', 0, 0, NULL, '2025-03-28 03:49:43'),
(18, 'loffic', 0, 0, NULL, '2025-03-28 03:54:40'),
(19, 'mop', 0, 0, NULL, '2025-03-28 03:58:18'),
(20, 'lio', 0, 0, NULL, '2025-03-28 04:00:55'),
(21, 'toli', 0, 0, NULL, '2025-03-28 04:03:12'),
(22, 'loki', 0, 0, NULL, '2025-03-28 04:03:24'),
(23, 'jojo', 0, 0, NULL, '2025-03-28 04:03:43'),
(24, 'thor', 0, 0, NULL, '2025-03-28 04:11:22'),
(25, 'bn', 0, 0, NULL, '2025-03-28 04:12:04'),
(26, 'ssd', 0, 0, NULL, '2025-03-28 04:12:55'),
(27, 'winx', 0, 0, NULL, '2025-03-28 04:13:52'),
(28, 'klarc', 0, 0, NULL, '2025-03-28 04:14:46'),
(29, 'bouh', 0, 0, NULL, '2025-03-28 04:16:51'),
(30, 'toto', 0, 0, NULL, '2025-03-28 04:22:53'),
(31, 'roro', 0, 0, NULL, '2025-03-28 04:23:47'),
(32, 'vovo', 0, 0, NULL, '2025-03-28 04:52:13'),
(33, 'koko', 0, 0, NULL, '2025-03-28 04:57:30'),
(34, 'admin', 0, 0, NULL, '2025-03-28 04:59:09'),
(35, 'ciraam', 0, 0, '2025-03-31 00:00:00', '2025-03-28 05:20:48'),
(36, 'ciraaam', 0, 0, NULL, '2025-04-17 06:25:17'),
(37, 'o', 0, 0, NULL, '2025-04-17 06:25:34'),
(38, 'OUI', 0, 0, NULL, '2025-04-17 06:25:50'),
(39, 'momo', 0, 0, NULL, '2025-04-17 22:58:02'),
(40, 'admintest', 0, 0, NULL, '2025-04-17 23:14:38'),
(41, 'loko', 0, 0, NULL, '2025-04-17 23:23:56');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `score_user_id` (`score_user_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_pseudo` (`user_pseudo`) USING HASH;

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `score`
--
ALTER TABLE `score`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_ibfk_1` FOREIGN KEY (`score_user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
