package main

type BasicRequest struct {
	CardID   string `json:"cardID"`
	CourseID int    `json:"courseID"`
}

type getAttendanceRequest struct {
	CourseID  int    `json:"courseID"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}

type User struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url,omitempty"`
	Pronouns  string `json:"pronouns,omitempty"`
}

type Course struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	// ID unique to every semester from canvas
	SemesterID int `json:"enrollment_term_id"`
}
type UserAttendance struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url,omitempty"`
	Pronouns  string `json:"pronouns,omitempty"`
	Date      string `json:"date"`
}

// Canvas API Responses

type getCoursesResponse []Course
type getStudentsResponse []User
