package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

func handleSetAttendance(c *gin.Context) {
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

	log.WithFields(log.Fields{"cardID": request.CardID, "classID": request.ClassID}).Info("[handleSetAttendance] Received data")

	userID, err := getUserIDFromCardID(c, request.CardID)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (2), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to lookup card in DB")
		return
	}

	if userID == "" {
		// card not found in db
		c.JSON(400, gin.H{"success": false, "error": "Card is not registred"})
		log.Trace("[handleSetAttendance] Card is not registred")
		return
	}

	err = addAttendanceToDB(c, userID, request.ClassID)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (2), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to add attendance to DB")
		return
	}

	c.JSON(200, gin.H{"success": true})
}

// checks if the id card is registered to a user and returns the userID if it does exist. If it doesn't exist, it returns an empty string and no error
func getUserIDFromCardID(ctx context.Context, cardID string) (string, error) {
	rows, err := db.QueryContext(ctx, "SELECT userID FROM idCard WHERE id=?;", cardID)
	if err != nil {
		return "", fmt.Errorf("error querying DB. %w", err)
	}

	if rows.Next() {
		var userID string
		rows.Scan(&userID)
		if userID != "" {
			return userID, nil
		}
	} else {
		err = rows.Err()
		if err != nil {
			return "", fmt.Errorf("error getting rows. %w", err)
		}
	}
	return "", nil
}

func addAttendanceToDB(ctx context.Context, studentID, classID string) error {
	alertID, err := getNewID()
	if err != nil {
		return fmt.Errorf("failed to get a new ID. %w", err)
	}
	_, err = db.ExecContext(ctx, "INSERT INTO attendance (id, studentID, classID, date) VALUES (?, ?, ?, now());", alertID, studentID, classID)
	return fmt.Errorf("faied to insert record into DB. %w", err)
}

// Returns a new v7 UUID.
// id, err := getNewID()
// id.String() to get it as a string " xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
func getNewID() (uuid.UUID, error) {
	// another option: https://planetscale.com/blog/why-we-chose-nanoids-for-planetscales-api
	id, err := uuid.NewV7()
	return id, err
}
