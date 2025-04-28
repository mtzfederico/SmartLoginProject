package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func handleGetStudentsList(c *gin.Context) {
	/*
		curl -X POST "localhost:9091/getStudents" -H 'Content-Type: application/json' -d '{"courseID": 31905}'
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
		log.WithField("error", err).Error("[handleSetAttendance] Failed to decode JSON")
		return
	}

	log.WithFields(log.Fields{"courseID": request.CourseID}).Info("[handleSetAttendance] Received data")

	users, err := getStudentsInClass(c, request.CourseID)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to get classes from DB")
		return
	}

	c.JSON(200, gin.H{"success": true, "students": users})
}

func getStudentsInClass(ctx context.Context, courseID int) ([]User, error) {
	rows, err := db.QueryContext(ctx, "SELECT users.id, users.name, users.pronouns, users.avatarURL FROM users INNER JOIN UsersInCourse ON users.id=UsersInCourse.studentID WHERE users.role='student' AND UsersInCourse.courseID=?;", courseID)
	if err != nil {
		return nil, fmt.Errorf("error querying DB. %w", err)
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
