-- Create the DB
DROP DATABASE IF EXISTS smartLoginProject;
CREATE DATABASE smartLoginProject;

-- select the database
USE smartLoginProject;

-- idk if we are going to use passwords
CREATE TABLE IF NOT EXISTS users (
  id               INTEGER        PRIMARY KEY,
  name             VARCHAR(50)    NOT NULL,
  pronouns         VARCHAR(30)    DEFAULT '',
  avatarURL        VARCHAR(250)   NOT NULL,
  lastUpdated      DATETIME       NOT NULL,
  email            VARCHAR(60),
  hashedPassword   VARCHAR(100),
  role             ENUM('student', 'professor', 'assistant') DEFAULT 'student' NOT NULL
);

-- Session authentication tokens, idk if we are going to use them.
CREATE TABLE IF NOT EXISTS authTokens (
  tokenID     VARCHAR(36)  PRIMARY KEY,
  userID      INTEGER      NOT NULL,
  loginDate   DATETIME     NOT NULL,
  CONSTRAINT authTokens_userID_fk FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
  id            INTEGER       PRIMARY KEY,
  name          VARCHAR(200)  NOT NULL,
  semesterID    INTEGER       NOT NULL,
  lastUpdated   DATETIME      NOT NULL,
  professorID   INTEGER
  -- , CONSTRAINT courses_professorID_fk FOREIGN KEY (professorID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UsersInCourse (
  id            VARCHAR(36)   PRIMARY KEY,
  courseID      INTEGER       NOT NULL,
  studentID     INTEGER       NOT NULL,
  status        ENUM('enrolled', 'dropped', 'failed') DEFAULT 'enrolled' NOT NULL,
  lastUpdated   DATETIME      NOT NULL,
  CONSTRAINT UsersInCourse_courseID_fk FOREIGN KEY (courseID) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT UsersInCourse_studentID_fk FOREIGN KEY (studentID) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
  id            VARCHAR(36)   PRIMARY KEY,
  studentID     INTEGER       NOT NULL,
  courseID      INTEGER       NOT NULL,
  arrivedLate   BOOL          NOT NULL  DEFAULT false,
  date          DATETIME      NOT NULL,
  CONSTRAINT attendance_studentID_fk FOREIGN KEY (studentID) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT attendance_courseID_fk FOREIGN KEY (courseID) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS idCard (
  id       VARCHAR(50)   PRIMARY KEY,
  userID   INTEGER       NOT NULL,
  date     DATETIME      NOT NULL,
  CONSTRAINT idCard_userID_fk FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);
