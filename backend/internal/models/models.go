package models

import "time"

// User represents the User entity in the system
type User struct {
	ID            string    `dynamodbav:"id"`
	Email         string    `dynamodbav:"email"`
	Name          *string   `dynamodbav:"name,omitempty"`
	Phone         *string   `dynamodbav:"phone,omitempty"`
	Role          string    `dynamodbav:"role"`
	EmailVerified bool      `dynamodbav:"emailVerified"`
	CreatedAt     time.Time `dynamodbav:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt"`
}

// Villa represents the Villa entity in the system
type Villa struct {
	ID            string    `dynamodbav:"id"`
	Slug          string    `dynamodbav:"slug"`
	Name          string    `dynamodbav:"name"`
	Location      string    `dynamodbav:"location"`
	PricePerNight int       `dynamodbav:"pricePerNight"`
	Guests        int       `dynamodbav:"guests"`
	BedroomCount  int       `dynamodbav:"bedroomCount"`
	BathroomCount int       `dynamodbav:"bathroomCount"`
	IsActive      bool      `dynamodbav:"isActive"`
	CreatedAt     time.Time `dynamodbav:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt"`
}

// Booking represents the Booking entity in the system
type Booking struct {
	ID        string    `dynamodbav:"id"`
	UserID    string    `dynamodbav:"userId"`
	VillaID   string    `dynamodbav:"villaId"`
	CheckIn   time.Time `dynamodbav:"checkIn"`
	CheckOut  time.Time `dynamodbav:"checkOut"`
	Guests    int       `dynamodbav:"guests"`
	Total     int       `dynamodbav:"total"`
	Status    string    `dynamodbav:"status"` // PENDING, CONFIRMED, CANCELLED
	CreatedAt time.Time `dynamodbav:"createdAt"`
	UpdatedAt time.Time `dynamodbav:"updatedAt"`
}
