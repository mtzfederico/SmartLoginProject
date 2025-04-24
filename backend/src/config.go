package main

import (
	"os"

	"github.com/goccy/go-yaml"
	log "github.com/sirupsen/logrus"
)

type Config struct {
	// IP and Port combination to listen on. A good default is "0.0.0.0:9091" for localhost on port 9091
	ListenOn string `yaml:"ListenOn" binding:"required"`
	// The path to the log file
	LogFile string `yaml:"LogFile"`
	// The DB address and port such as "127.0.0.1:3306"
	DBAddress string `yaml:"DBAddress" binding:"required"`
	// The DB user
	DBUser string `yaml:"DBUser" binding:"required"`
	// The password for the DB user
	DBPassword string `yaml:"DBPassword" binding:"required"`
	// The name of the DB to use
	DBName string `yaml:"DBName" binding:"required"`
	// The name of the bucket used
	CanvasAPIToken string `yaml:"CanvasAPIToken"`
	// The log level. Options: "panic", "fatal", "error", "warn", "info", "debug", "trace".
	// https://github.com/sirupsen/logrus/blob/dd1b4c2e81afc5c255f216a722b012ed26be57df/logrus.go#L25
	LogLevel string `yaml:"LogLevel" binding:"required"`
	// Set the mode for the http library, Gin, to "release" or "debug".
	// More info in https://github.com/gin-gonic/gin/issues/2984
	GINRelease bool `yaml:"GINMode" binding:"required"`
}

// Reads the yaml file specified in the path
func (c *Config) readFile(configPath string) *Config {
	yamlFile, err := os.ReadFile(configPath)
	if err != nil {
		log.WithField("err", err).Error("[Config.readFile] Error reading file")
	}
	err = yaml.Unmarshal(yamlFile, c)
	if err != nil {
		log.WithField("err", err).Fatal("[Config.readFile] Error parsing yaml")
	}

	return c
}
