package main

import (
	"database/sql"
	_ "embed"
	"flag"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	log "github.com/sirupsen/logrus"
)

// The server's config
var serverConfig Config

// The database connection pool
var db *sql.DB

func main() {
	configPath := flag.String("config", "config.yaml", "Path to the configuration file")
	flag.Parse()

	if *configPath == "" {
		log.Fatal("[main] config flag missing. use --config path/to/config.yaml")
	}

	serverConfig.readFile(*configPath)

	// if a logFile was secified, set it as the output
	if serverConfig.LogFile != "" {
		// If the log file doesn't exist, create it, otherwise append to the file
		file, err := os.OpenFile(serverConfig.LogFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0664)
		if err != nil {
			log.WithField("Error", err).Fatal("[main] Logging file error")
		}

		log.SetOutput(file)
	} else {
		log.Warn("[main] No LogFile specified. Logging to stderr")
	}

	// Set loglevel
	if serverConfig.LogLevel != "" {
		level, err := log.ParseLevel(serverConfig.LogLevel)

		if err != nil {
			log.WithField("err", err).Error("[main] DebugLevel has an invalid value")
		} else {
			log.Info("[main] Log Level set to ", serverConfig.LogLevel)
			log.SetLevel(level)
		}
	}

	if serverConfig.ListenOn == "" {
		log.Fatal("[main] No ListenOn specified")
	}

	log.Info("Starting server")

	if serverConfig.GINRelease {
		gin.SetMode(gin.ReleaseMode)
	}

	cfg := mysql.Config{
		User:                 serverConfig.DBUser,
		Passwd:               serverConfig.DBPassword,
		Net:                  "tcp",
		Addr:                 serverConfig.DBAddress,
		DBName:               serverConfig.DBName,
		AllowNativePasswords: true,
		ParseTime:            true,
	}

	dbDSN := cfg.FormatDSN()
	log.WithField("DSN", dbDSN).Trace("[main] DB Config in DSN Format")
	var err error
	db, err = sql.Open("mysql", dbDSN)
	if err != nil {
		log.Fatal(err)
	}

	// Verify that connection to DB is working
	pingErr := db.Ping()
	if pingErr != nil {
		log.WithField("pingErr", pingErr).Fatal("[main] Failed to connect to DB")
	}

	// erro := getDataFromCanva(context.Background())
	// if erro != nil {
	// 	fmt.Println(erro)
	// }
	// return

	router := gin.Default()

	// Handle 404s
	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": "Page not found"})
	})

	router.GET("getCourses", handleGetCourses)
	router.POST("getStudents", handleGetStudentsList)
	router.POST("getStudentsWithNoID", handleGetStudentsWithNoID)
	router.POST("registerIDCard", handleRegisterIDCard)
	router.POST("setAttendance", handleSetAttendance)
	router.POST("getAttendance", handleGetAttendance)
	router.GET("refreshData", handleRefreshData)

	// router.Use(cors.Default())
	router.Use(CORSMiddleware())
	router.Run(serverConfig.ListenOn)
}

func CORSMiddleware() gin.HandlerFunc {
	// https://stackoverflow.com/questions/29418478/go-gin-framework-cors
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
