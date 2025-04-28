package main

type BasicRequest struct {
	CardID   string `json:"cardID"`
	CourseID int    `json:"courseID"`
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

// Canvas API Responses

type getCoursesResponse []Course
type getStudentsResponse []User
