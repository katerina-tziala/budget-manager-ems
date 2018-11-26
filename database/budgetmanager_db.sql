SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `budgetmanager`
--
-- --------------------------------------------------------
--
-- Table structure for table `user`
--
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `gender` enum('male','female') COLLATE utf8_unicode_ci NOT NULL,
  `birthdate` date NOT NULL,
  `feedback` int(1) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activationcode` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `verified` int(1) NOT NULL DEFAULT '0',
  `signed_in` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
--
-- Table structure for table `budget`
--
CREATE TABLE `budget` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `budget_from` date NOT NULL,
  `budget_to` date NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `category`
--
CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `added_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
--
-- Dumping data for table `category`
--
INSERT INTO `category` (`id`, `category_name`, `added_by`) VALUES
(1, 'bar & café', NULL),
(2, 'bills & fees', NULL),
(3, 'clothing', NULL),
(4, 'communication', NULL),
(5, 'cosmetics & beauty', NULL),
(6, 'donations & charity', NULL),
(7, 'education', NULL),
(8, 'entertainment', NULL),
(9, 'gifts', NULL),
(10, 'health', NULL),
(11, 'housing', NULL),
(12, 'investments', NULL),
(13, 'restaurant & delivery', NULL),
(14, 'sports & fitness', NULL),
(15, 'supermarket', NULL),
(16, 'technology', NULL),
(17, 'transportation', NULL),
(18, 'traveling & vacation', NULL),
(19, 'vehicle', NULL),
(20, 'miscellaneous', NULL);
-- --------------------------------------------------------
--
-- Table structure for table `expense`
--
CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `payment` enum('cash','credit card','debit card','prepaid card','gift card', 'bank transfer','check','mobile payment','web payment') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'cash',
  `expense_date` date NOT NULL,
  `expense_time` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `feedback`
--
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `budget_id` int(11) NOT NULL,
  `type` enum('regular','affective gifs') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'regular',
  `user_performance` enum('fail','success') COLLATE utf8_unicode_ci NOT NULL,
  `served_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `goal`
--
CREATE TABLE `goal` (
  `id` int(11) NOT NULL,
  `budget_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `log_activity`
--
CREATE TABLE `log_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_time` datetime NOT NULL,
  `activity_type` enum('sign_in','sign_out') COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `log_budget`
--
CREATE TABLE `log_budget` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `budget_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `budget_from` date NOT NULL,
  `budget_to` date NOT NULL,
  `log_type` enum('inserted','deleted','updated') COLLATE utf8_unicode_ci NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `log_category`
--
CREATE TABLE `log_category` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `log_type` enum('inserted','deleted','updated') COLLATE utf8_unicode_ci NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `log_expense`
--
CREATE TABLE `log_expense` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expense_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `payment` enum('cash','credit card','debit card','prepaid card','gift card', 'bank transfer','check','mobile payment','web payment') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'cash',
  `expense_date` date NOT NULL,
  `expense_time` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `log_type` enum('inserted','deleted','updated') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'inserted',
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `log_goal`
--
CREATE TABLE `log_goal` (
  `id` int(11) NOT NULL,
  `goal_id` int(11) NOT NULL,
  `budget_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `log_type` enum('inserted','updated','deleted') COLLATE utf8_unicode_ci NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Table structure for table `log_user`
--
CREATE TABLE `log_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `updated_field` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `prev_value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `new_value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- --------------------------------------------------------
--
-- Indexes for dumped tables
--
--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_budgetUserId` (`user_id`);
--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_categoryUserId` (`added_by`);
--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_expenseUserId` (`user_id`);
--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feedbackBudgetId` (`budget_id`),
  ADD KEY `fk_feedbackUserId` (`user_id`);
--
-- Indexes for table `goal`
--
ALTER TABLE `goal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_goalBudgetId` (`budget_id`),
  ADD KEY `fk_goalUserId` (`user_id`);
--
-- Indexes for table `log_activity`
--
ALTER TABLE `log_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logActivityUserId` (`user_id`);
--
-- Indexes for table `log_budget`
--
ALTER TABLE `log_budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logBudgetUserId` (`user_id`);
--
-- Indexes for table `log_category`
--
ALTER TABLE `log_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logCategoryUserId` (`user_id`);
--
-- Indexes for table `log_expense`
--
ALTER TABLE `log_expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logExpenseUserId` (`user_id`);
--
-- Indexes for table `log_goal`
--
ALTER TABLE `log_goal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logGoalBudgetId` (`budget_id`),
  ADD KEY `fk_logGoalUserId` (`user_id`);
--
-- Indexes for table `log_user`
--
ALTER TABLE `log_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logUserId` (`user_id`);
--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_email` (`email`),
  ADD UNIQUE KEY `UC_username` (`username`);
--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `budget`
--
ALTER TABLE `budget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `goal`
--
ALTER TABLE `goal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_activity`
--
ALTER TABLE `log_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_budget`
--
ALTER TABLE `log_budget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_category`
--
ALTER TABLE `log_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_expense`
--
ALTER TABLE `log_expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_goal`
--
ALTER TABLE `log_goal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_user`
--
ALTER TABLE `log_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--
--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `fk_budgetUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_categoryUserId` FOREIGN KEY (`added_by`) REFERENCES `user` (`id`);
--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `fk_expenseUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedbackBudgetId` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `fk_feedbackUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `goal`
--
ALTER TABLE `goal`
  ADD CONSTRAINT `fk_goalBudgetId` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `fk_goalUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `log_activity`
--
ALTER TABLE `log_activity`
  ADD CONSTRAINT `fk_logActivityUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `log_budget`
--
ALTER TABLE `log_budget`
  ADD CONSTRAINT `fk_logBudgetUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `log_category`
--
ALTER TABLE `log_category`
  ADD CONSTRAINT `fk_logCategoryUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `log_expense`
--
ALTER TABLE `log_expense`
  ADD CONSTRAINT `fk_logExpenseUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `log_goal`
--
ALTER TABLE `log_goal`
  ADD CONSTRAINT `fk_logGoalBudgetId` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `fk_logGoalUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
--
-- Constraints for table `log_user`
--
ALTER TABLE `log_user`
  ADD CONSTRAINT `fk_logUserId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
