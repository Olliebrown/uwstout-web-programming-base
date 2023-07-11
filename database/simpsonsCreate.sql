SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema simpsons
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `simpsons` DEFAULT CHARACTER SET utf8 ;
USE `simpsons` ;

-- -----------------------------------------------------
-- Table `simpsons`.`teachers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `simpsons`.`teachers`;
CREATE TABLE IF NOT EXISTS `simpsons`.`teachers` (
  `id` INT(10) UNSIGNED NOT NULL,
  `name` VARCHAR(32) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
INSERT INTO teachers (id, name)
  VALUES (1234, 'Edna Krabappel'),
         (5678, 'Elizabeth Hoover'),
         (9012, 'Seth Berrier');

-- -----------------------------------------------------
-- Table `simpsons`.`courses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `simpsons`.`courses`;
CREATE TABLE IF NOT EXISTS `simpsons`.`courses` (
  `id` INT(10) UNSIGNED NOT NULL,
  `name` VARCHAR(32) NULL DEFAULT NULL,
  `teacher_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `teacherkey_idx` (`teacher_id` ASC) VISIBLE,
  CONSTRAINT `teacherkey`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `simpsons`.`teachers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
INSERT INTO courses (id, name, teacher_id)
  VALUES (10001, 'CS 144', 1234),
         (10002, 'CS 145', 5678),
         (10003, 'CS 248', 9012),
         (10004, 'CNIT 133', 1234),
         (10005, 'ICT 215', 1234);


-- -----------------------------------------------------
-- Table `simpsons`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `simpsons`.`students`;
CREATE TABLE IF NOT EXISTS `simpsons`.`students` (
  `id` INT(10) UNSIGNED NOT NULL,
  `name` VARCHAR(32) NULL DEFAULT NULL,
  `email` VARCHAR(32) NULL DEFAULT NULL,
  `password` VARCHAR(16) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
INSERT INTO students (id, name, email, password)
  VALUES (123, 'Bart Simpson', 'barts@hotmail.com', 'password'),
         (456, 'Milhouse Van Houten', 'milhousevh@gmail.com', 'qwertyuiop'),
         (888, 'Lisa Simpson', 'simpsonl4042@uwsout.edu', 'ncc-1701'),
         (404, 'Ralph Wiggum', 'wiggumralphy@example.com', 'learnding');


-- -----------------------------------------------------
-- Table `simpsons`.`grades`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `simpsons`.`grades`;
CREATE TABLE IF NOT EXISTS `simpsons`.`grades` (
  `student_id` INT(10) UNSIGNED NOT NULL,
  `course_id` INT(10) UNSIGNED NOT NULL,
  `grade` VARCHAR(2) NULL DEFAULT NULL,
  INDEX `studentkey_idx` (`student_id` ASC) VISIBLE,
  INDEX `coursekey_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `studentkey`
    FOREIGN KEY (`student_id`)
    REFERENCES `simpsons`.`students` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `coursekey`
    FOREIGN KEY (`course_id`)
    REFERENCES `simpsons`.`courses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
INSERT INTO grades (student_id, course_id , grade)
  VALUES (123, 10001, 'B-'),
         (123, 10002, 'C'),
         (456, 10001, 'B+'),
         (888, 10002, 'A+'),
         (888, 10003, 'A+'),
         (404, 10004, 'D+'),
         (888, 10005, 'A+'),
         (456, 10005, 'B-');


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
