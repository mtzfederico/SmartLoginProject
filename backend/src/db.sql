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
  UNIQUE (userID),
  CONSTRAINT idCard_userID_fk FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);
select * from courses order by semesterID asc;

select * from users;
SELECT * FROM idCard;
SELECT users.id, users.name, users.pronouns, users.avatarURL FROM users INNER JOIN UsersInCourse ON users.id=UsersInCourse.studentID INNER JOIN idCard ON users.id=idCard.userID WHERE users.role='student' AND UsersInCourse.courseID=31631 AND EXISTS (SELECT NULL FROM idCard WHERE idCard.userID=users.id);

SELECT users.id, users.name, users.pronouns, users.avatarURL FROM users INNER JOIN UsersInCourse ON users.id = UsersInCourse.studentID LEFT JOIN idCard ON users.id = idCard.userID WHERE users.role = 'student' AND UsersInCourse.courseID = 31905 AND idCard.userID IS NULL;

SELECT users.id, users.name, users.pronouns, users.avatarURL FROM users INNER JOIN attendance ON users.id=attendance.studentID WHERE users.role='student' AND attendance.courseID=? AND attendance.date BETWEEN '2012-12-25 00:00:00' AND '2012-12-25 23:59:59';
