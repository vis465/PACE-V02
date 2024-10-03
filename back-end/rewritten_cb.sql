
-- Rewritten SQL file for the project --

-- Create `users` table to store user details --
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_mail` VARCHAR(255) NOT NULL UNIQUE,
  `user_password` VARCHAR(255) NOT NULL,
  `role` ENUM('stu', 'sta') NOT NULL,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `timecreated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `history` table for tracking actions --
CREATE TABLE `history` (
  `history_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `timecreated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `student_info` table to store student metadata --
CREATE TABLE `student_info` (
  `student_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `department` VARCHAR(255) NOT NULL,
  `current_semester` INT NOT NULL,
  `cgpa` FLOAT,
  `arrears_count` INT DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `subjects` table to store academic performance per subject --
CREATE TABLE `subjects` (
  `subject_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `semester` INT NOT NULL,
  `subject_code` VARCHAR(10) NOT NULL,
  `cie1` FLOAT NOT NULL,
  `cie2` FLOAT NOT NULL,
  `cie3` FLOAT NOT NULL,
  `final_exam` FLOAT NOT NULL,
  `final_marks` FLOAT NOT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `student_info`(`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Completed SQL structure for the project --
