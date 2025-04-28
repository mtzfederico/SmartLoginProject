package main

import (
	"context"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func handleGetStudentsList(c *gin.Context) {
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

	log.WithFields(log.Fields{"classID": request.ClassID}).Info("[handleSetAttendance] Received data")

	users, err := getAvailableUsersFromClass(c, request.ClassID)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to get classes from DB")
		return
	}

	c.JSON(200, gin.H{"success": true, "users": users})
}

func getAvailableUsersFromClass(ctx context.Context, classID string) ([]User, error) {
	return nil, nil
}
