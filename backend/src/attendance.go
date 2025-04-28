package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

func handleSetAttendance(c *gin.Context) {
	/*
		curl -X POST "localhost:9091/setAttendance" -H 'Content-Type: application/json' -d '{"cardID": "6363530000196087", "courseID": 31905}'
	*/

	if c.Request.Body == nil {
		c.JSON(400, gin.H{"success": false, "error": "No data received"})
		return
	}

	var request BasicRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to decode JSON")
		return
	}

	log.WithFields(log.Fields{"cardID": request.CardID, "classID": request.CourseID}).Info("[handleSetAttendance] Received data")

	userID, err := getUserIDFromCardID(c, request.CardID)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (2), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to lookup card in DB")
		return
	}

	if userID <= 1 {
		// card not found in db
		c.JSON(400, gin.H{"success": false, "error": "Card is not registred"})
		log.Trace("[handleSetAttendance] Card is not registred")
		return
	}

	err = addAttendanceToDB(c, userID, request.CourseID)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (2), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to add attendance to DB")
		return
	}

	c.JSON(200, gin.H{"success": true})
}

func handleGetAttendance(c *gin.Context) {
	/*
		curl -X POST "localhost:9091/getAttendance" -H 'Content-Type: application/json' -d '{"courseID": 31905, "startDate": "2012-12-25 00:00:00", "endDate": "2012-12-25 23:59:59"}'
	*/

	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

	if c.Request.Body == nil {
		c.JSON(400, gin.H{"success": false, "error": "No data received"})
		return
	}

	// only the classID is used here
	var request GetAttendanceRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleGetAttendance] Failed to decode JSON")
		return
	}

	log.WithFields(log.Fields{"courseID": request.CourseID}).Info("[handleGetAttendance] Received data")

	users, err := getAttendanceForClass(c, request.CourseID, request.StartDate, request.EndDate)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleGetAttendance] Failed to get classes from DB")
		return
	}

	c.JSON(200, gin.H{"success": true, "students": users})
}

// checks if the id card is registered to a user and returns the userID if it does exist. If it doesn't exist, it returns an empty string and no error
func getUserIDFromCardID(ctx context.Context, cardID string) (int, error) {
	rows, err := db.QueryContext(ctx, "SELECT userID FROM idCard WHERE id=?;", cardID)
	if err != nil {
		return -1, fmt.Errorf("error querying DB. %w", err)
	}

	if rows.Next() {
		var userID int
		rows.Scan(&userID)
		if userID <= 1 {
			return userID, nil
		}
	} else {
		err = rows.Err()
		if err != nil {
			return -1, fmt.Errorf("error getting rows. %w", err)
		}
	}
	return -1, nil
}

func addAttendanceToDB(ctx context.Context, studentID int, courseID int) error {
	alertID, err := getNewID()
	if err != nil {
		return fmt.Errorf("failed to get a new ID. %w", err)
	}
	_, err = db.ExecContext(ctx, "INSERT INTO attendance (id, studentID, courseID, date) VALUES (?, ?, ?, now());", alertID, studentID, courseID)
	if err != nil {
		return fmt.Errorf("faied to insert record into DB. %w", err)
	}
	return nil
}

func getAttendanceForClass(ctx context.Context, courseID int, startDate, endDate string) ([]UserAttendance, error) {
	rows, err := db.QueryContext(ctx, "SELECT users.id, users.name, users.pronouns, users.avatarURL, attendance.date FROM users INNER JOIN attendance ON users.id=attendance.studentID WHERE users.role='student' AND attendance.courseID=? AND attendance.date BETWEEN ? AND ?;", courseID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("error querying DB. %w", err)
	}

	var users []UserAttendance = []UserAttendance{}

	for rows.Next() {
		var userAttendance UserAttendance
		rows.Scan(&userAttendance.ID, &userAttendance.Name, &userAttendance.Pronouns, &userAttendance.AvatarURL, &userAttendance.Date)
		users = append(users, userAttendance)
	}

	if len(users) == 0 {
		err := rows.Err()
		if err != nil {
			return nil, fmt.Errorf("error getting rows. %w", err)
		}
	}

	return users, nil
}

// Returns a new v7 UUID.
// id, err := getNewID()
// id.String() to get it as a string " xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
func getNewID() (uuid.UUID, error) {
	// another option: https://planetscale.com/blog/why-we-chose-nanoids-for-planetscales-api
	id, err := uuid.NewV7()
	return id, err
}
