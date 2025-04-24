package main

import (
	"github.com/gin-gonic/gin"
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
		log.WithField("error", err).Error("[handleLogout] Failed to decode JSON")
		return
	}

	log.WithFields(log.Fields{"cardID": request.CardID, "classID": request.ClassID}).Info("[handleSetAttendance] Received data")

	c.JSON(200, gin.H{"message": "not implemented yet"})
}
