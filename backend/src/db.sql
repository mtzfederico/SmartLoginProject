-- Create the DB
DROP DATABASE IF EXISTS smartLoginProject;
CREATE DATABASE smartLoginProject;

-- select the database
USE smartLoginProject;

-- idk if we are going to use passwords
CREATE TABLE IF NOT EXISTS users (
  userID           VARCHAR(36)     PRIMARY KEY,
  firstName        VARCHAR(50)     NOT NULL,
  lastName         VARCHAR(50)     NOT NULL,
  email            VARCHAR(60),
  hashedPassword   VARCHAR(100),
  role             ENUM('student', 'professor', 'assistant') DEFAULT 'student' NOT NULL,
);

-- Session authentication tokens, idk if we are going to use them.
CREATE TABLE IF NOT EXISTS authTokens (
  tokenID     VARCHAR(36)  PRIMARY KEY,
  userID      VARCHAR(36)  NOT NULL,
  loginDate   DATETIME     NOT NULL,
  CONSTRAINT authTokens_userID_fk FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
  id            VARCHAR(36)   PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  professorID   VARCHAR(36)   NOT NULL,
  CONSTRAINT classes_professorID_fk FOREIGN KEY (professorID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
  id            VARCHAR(36)   PRIMARY KEY,
  studentID     VARCHAR(36)   NOT NULL,
  classID       VARCHAR(36)   NOT NULL,
  arrivedLate   BOOL          NOT NULL  DEFAULT false,
  date          DATETIME      NOT NULL,
  CONSTRAINT attendance_studentID_fk FOREIGN KEY (fileID) REFERENCES users(userID) ON DELETE CASCADE,
  CONSTRAINT attendance_classID_fk FOREIGN KEY (classID) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS idCard (
  id       VARCHAR(50)   PRIMARY KEY,
  userID   VARCHAR(36)   NOT NULL,
  date     DATETIME      NOT NULL,
  CONSTRAINT idCard_userID_fk FOREIGN KEY (id) REFERENCES users(userID) ON DELETE CASCADE,
  CONSTRAINT attendance_classID_fk FOREIGN KEY (classID) REFERENCES classes(id) ON DELETE CASCADE
);