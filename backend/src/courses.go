package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func handleGetCourses(c *gin.Context) {
	courses, err := getCoursesInDB(c)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleSetAttendance] Failed to get courses from DB")
		return
	}

	c.JSON(200, gin.H{"success": true, "courses": courses})
}

func handleRefreshData(c *gin.Context) {
	err := getDataFromCanvas(c)
	if err != nil {
		c.JSON(500, gin.H{"success": false, "error": "Internal Server Error (0), Please try again later"})
		log.WithField("error", err).Error("[handleRefreshData] Failed to get data from canvas")
		return
	}

	c.JSON(200, gin.H{"success": true})
}

func getCoursesInDB(ctx context.Context) ([]Course, error) {
	rows, err := db.QueryContext(ctx, "SELECT id, name, semesterID FROM courses;")
	if err != nil {
		return nil, fmt.Errorf("error querying DB. %w", err)
	}

	var courses []Course = []Course{}

	for rows.Next() {
		var class Course
		rows.Scan(&class.ID, &class.Name, &class.SemesterID)
		courses = append(courses, class)
	}

	if len(courses) == 0 {
		err := rows.Err()
		if err != nil {
			return nil, fmt.Errorf("error getting rows. %w", err)
		}
	}

	return courses, nil
}

// gets the courses from canvas and all of the students in those classes and stores them in the db
func getDataFromCanvas(ctx context.Context) error {
	url := fmt.Sprintf("https://nyit.instructure.com/api/v1/courses/?access_token=%s&per_page=100", serverConfig.CanvasAPIToken)

	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to get data from canvas. %w", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Request failed with status code:", resp.StatusCode)
		os.Exit(1)
	}

	var response getCoursesResponse

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return fmt.Errorf("failed to decode JSON. %w", err)
	}

	log.WithField("count", len(response)).Info("[getDataFromCanvas] Got courses")
	for _, course := range response {
		fmt.Printf("Adding course: %v\n", course)
		err = addCourse(ctx, course)
		if err != nil {
			return fmt.Errorf("failed to add course '%d'. %w", course.ID, err)
		}
		err = getStudentsInCourseFromCanvas(ctx, course.ID)
		if err != nil {
			return fmt.Errorf("failed to get students in course '%d'. %w", course.ID, err)
		}
	}

	// check users that have an old date and modify them
	err = markOldStudentsAsDropped(ctx)
	if err != nil {
		return fmt.Errorf("markOldStudentsAsDropped error. %w", err)
	}

	return nil
}

func getStudentsInCourseFromCanvas(ctx context.Context, courseID int) error {
	url := fmt.Sprintf("https://nyit.instructure.com/api/v1/courses/%d/users?access_token=%s&enrollment_type[]=student&per_page=100&include[]=avatar_url", courseID, serverConfig.CanvasAPIToken)

	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to get data from canvas. %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Request failed with status code:", resp.StatusCode)
		os.Exit(1)
	}

	/*
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
		}
		fmt.Println(string(body))
	*/

	var response getStudentsResponse

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return fmt.Errorf("failed to decode JSON. %w", err)
	}

	for _, student := range response {
		fmt.Printf("\tAdding %v\n", student)
		err = addStudent(ctx, student, courseID)
		if err != nil {
			return fmt.Errorf("failed to add student. %w", err)
		}
	}
	return nil
}

func addCourse(ctx context.Context, course Course) error {
	_, err := db.ExecContext(ctx, "INSERT INTO courses (id, name, semesterID, lastUpdated) VALUES (?, ?, ?, now()) ON DUPLICATE KEY UPDATE lastUpdated=now();", course.ID, course.Name, course.SemesterID)
	return err
}

func addStudent(ctx context.Context, student User, courseID int) error {
	_, err := db.ExecContext(ctx, "INSERT INTO users (id, name, pronouns, avatarURL, lastUpdated) VALUES (?, ?, ?, ?, now()) ON DUPLICATE KEY UPDATE lastUpdated=now();", student.ID, student.Name, student.Pronouns, student.AvatarURL)
	if err != nil {
		return fmt.Errorf("failed to add student to users table. %w", err)
	}

	relationID, err := getNewID()
	if err != nil {
		return fmt.Errorf("failed to get a new ID. %w", err)
	}

	_, err = db.ExecContext(ctx, "INSERT INTO UsersInCourse (id, courseID, studentID, status, lastUpdated) VALUES (?, ?, ?, 'enrolled', now()) ON DUPLICATE KEY UPDATE status='enrolled', lastUpdated=now();", relationID, courseID, student.ID)
	if err != nil {
		return fmt.Errorf("failed to add student to UsersInCourse table. %w", err)
	}

	return nil
}

func markOldStudentsAsDropped(ctx context.Context) error {
	res, err := db.ExecContext(ctx, "UPDATE UsersInCourse SET status='dropped' WHERE status='enrolled' AND lastUpdated <= DATE_SUB(now(), INTERVAL 30 MINUTE);")
	if err != nil {
		return fmt.Errorf("failed to update rows rows. %w", err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check rows affected. %w", err)
	}
	log.WithField("rowsAffected", n).Info("[markOldStudentsAsDropped] done")
	return nil
}

/*
func getSemesterName(semesterID int) string {
	switch semesterID {
	case 175:
		return "Fall 2023"
	case 142:
		return "Spring 2024"
	case 177:
		return "Fall 2024"
	case 157:
		return "Spring 2025"
	default:
		return fmt.Sprintf("Unknown (%d)", semesterID)
	}
}*/
