-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema littleIMDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `littleIMDB` DEFAULT CHARACTER SET utf8 ;

-- -----------------------------------------------------
-- Schema people
-- -----------------------------------------------------
USE `littleIMDB` ;

-- -----------------------------------------------------
-- Table `littleIMDB`.`movie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`movie` ;
CREATE TABLE IF NOT EXISTS `littleIMDB`.`movie` (
  `id` VARCHAR(10) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `year` SMALLINT(6) NOT NULL,
  `plot` TEXT NULL DEFAULT NULL,
  `mpaa_rating` VARCHAR(10) NULL DEFAULT NULL,
  `imdb_rating` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `littleIMDB`.`actor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`actor` ;
CREATE TABLE IF NOT EXISTS `littleIMDB`.`actor` (
  `id` VARCHAR(10) NOT NULL,
  `prefix` VARCHAR(4) NULL DEFAULT NULL,
  `f_name` VARCHAR(100) NOT NULL,
  `m_initials` VARCHAR(50) NULL DEFAULT NULL,
  `l_name` VARCHAR(100) NULL DEFAULT NULL,
  `suffix` VARCHAR(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `littleIMDB`.`crew`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`crew` ;
CREATE TABLE IF NOT EXISTS `littleIMDB`.`crew` (
  `id` VARCHAR(10) NOT NULL,
  `prefix` VARCHAR(4) NULL DEFAULT NULL,
  `f_name` VARCHAR(100) NOT NULL,
  `m_initials` VARCHAR(50) NULL DEFAULT NULL,
  `l_name` VARCHAR(100) NULL DEFAULT NULL,
  `suffix` VARCHAR(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `littleIMDB`.`crew_genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`crew_genres` ;
CREATE TABLE IF NOT EXISTS `littleIMDB`.`crew_genres` (
  `genre` VARCHAR(100) NOT NULL,
  `crew_id` VARCHAR(10) NOT NULL,
  `movie_id` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`crew_id`, `movie_id`, `genre`),
  INDEX `fk_crew_genres_crew1_idx` (`crew_id` ASC) VISIBLE,
  INDEX `fk_crew_genres_movie1_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_crew_genres_crew1`
    FOREIGN KEY (`crew_id`)
    REFERENCES `littleIMDB`.`crew` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_crew_genres_movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `littleIMDB`.`movie` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `littleIMDB`.`movies_actors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`movies_actors` ;
CREATE TABLE IF NOT EXISTS `littleIMDB`.`movies_actors` (
  `movie_id` VARCHAR(10) NOT NULL,
  `actor_id` VARCHAR(10) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`movie_id`, `actor_id`, `role`),
  INDEX `fk_movie_has_actor_actor1_idx` (`actor_id` ASC) VISIBLE,
  INDEX `fk_movie_has_actor_movie_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_movie_has_actor_movie`
    FOREIGN KEY (`movie_id`)
    REFERENCES `littleIMDB`.`movie` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_movie_has_actor_actor1`
    FOREIGN KEY (`actor_id`)
    REFERENCES `littleIMDB`.`actor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `littleIMDB`.`movies_crew`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`movies_crew` ;

CREATE TABLE IF NOT EXISTS `littleIMDB`.`movies_crew` (
  `movie_id` VARCHAR(10) NOT NULL,
  `crew_id` VARCHAR(10) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`role`, `movie_id`, `crew_id`),
  INDEX `fk_movie_has_crew_crew1_idx` (`crew_id` ASC) VISIBLE,
  INDEX `fk_movie_has_crew_movie1_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_movie_has_crew_movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `littleIMDB`.`movie` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_movie_has_crew_crew1`
    FOREIGN KEY (`crew_id`)
    REFERENCES `littleIMDB`.`crew` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `littleIMDB`.`movie_genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `littleIMDB`.`movie_genres` ;

CREATE TABLE IF NOT EXISTS `littleIMDB`.`movie_genres` (
  `genre` VARCHAR(100) NOT NULL,
  `movie_id` VARCHAR(10) NOT NULL,
  INDEX `fk_move_genres_movie1_idx` (`movie_id` ASC) VISIBLE,
  PRIMARY KEY (`movie_id`, `genre`),
  CONSTRAINT `fk_move_genres_movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `littleIMDB`.`movie` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
