package main

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func handleGetStudentsWithNoID(c *gin.Context) {
	/*
		curl -X POST "localhost:9091/getStudentsWithNoID" -H 'Content-Type: application/json' -d '{"courseID": 31905}'
	*/

	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

	if c.Request.Body == nil {
		c.JSON(400, gin.H{"success": false, "error": "No data received"})
		return
	}

	// only the classID is used here
	var request BasicRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleGetStudentsWithNoID] Failed to decode JSON")
		return
	}

	log.WithFields(log.Fields{"courseID": request.CourseID}).Info("[handleGetStudentsWithNoID] Received data")

	users, err := getStudentsInClass(c, request.CourseID, false)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleGetStudentsWithNoID] Failed to get classes from DB")
		return
	}

	c.JSON(200, gin.H{"success": true, "students": users})
}

func handleGetStudentsList(c *gin.Context) {
	/*
		curl -X POST "localhost:9091/getStudents" -H 'Content-Type: application/json' -d '{"courseID": 31905}'
	*/

	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

	if c.Request.Body == nil {
		c.JSON(400, gin.H{"success": false, "error": "No data received"})
		return
	}

	// only the classID is used here
	var request BasicRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to decode JSON")
		return
	}

	log.WithFields(log.Fields{"courseID": request.CourseID}).Info("[handleSetAttendance] Received data")

	users, err := getStudentsInClass(c, request.CourseID, true)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to get classes from DB")
		return
	}

	c.JSON(200, gin.H{"success": true, "students": users})
}

func getStudentsInClass(ctx context.Context, courseID int, getAll bool) ([]User, error) {
	var rows *sql.Rows
	var err error

	if getAll {
		rows, err = db.QueryContext(ctx, "SELECT users.id, users.name, users.pronouns, users.avatarURL FROM users INNER JOIN UsersInCourse ON users.id=UsersInCourse.studentID INNER JOIN idCard ON users.id=idCard.userID WHERE users.role='student' AND UsersInCourse.courseID=? AND NOT EXISTS (SELECT COUNT(*) FROM idCard WHERE idCard.userID=users.id);", courseID)
	} else {
		rows, err = db.QueryContext(ctx, "SELECT users.id, users.name, users.pronouns, users.avatarURL FROM users INNER JOIN UsersInCourse ON users.id = UsersInCourse.studentID LEFT JOIN idCard ON users.id = idCard.userID WHERE users.role = 'student' AND UsersInCourse.courseID = ? AND idCard.userID IS NULL;", courseID)
	}
	if err != nil {
		return nil, fmt.Errorf("error querying DB. getAll: %t. %w", getAll, err)
	}

	var users []User = []User{}

	for rows.Next() {
		var user User
		rows.Scan(&user.ID, &user.Name, &user.Pronouns, &user.AvatarURL)
		users = append(users, user)
	}

	if len(users) == 0 {
		err := rows.Err()
		if err != nil {
			return nil, fmt.Errorf("error getting rows. %w", err)
		}
	}

	return users, nil
}

// func getAvailableUsersFromClass()
