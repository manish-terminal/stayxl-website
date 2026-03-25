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
	ID            string    `dynamodbav:"id"`
	UserID        string    `dynamodbav:"userId"`
	VillaID       string    `dynamodbav:"villaId"`
	VillaSlug     string    `dynamodbav:"villaSlug"`
	CheckIn       time.Time `dynamodbav:"checkIn"`
	CheckOut      time.Time `dynamodbav:"checkOut"`
	Guests        int       `dynamodbav:"guests"`
	BaseAmount    int       `dynamodbav:"baseAmount"`
	DiscountAmount int      `dynamodbav:"discountAmount"`
	TotalAmount   int       `dynamodbav:"totalAmount"`
	Status        string    `dynamodbav:"status"` // PENDING, CONFIRMED, CANCELLED
	PaymentID     string    `dynamodbav:"paymentId,omitempty"`
	CouponCode    string    `dynamodbav:"couponCode,omitempty"`
	CreatedAt     time.Time `dynamodbav:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt"`
}

// BlockedDate represents dates blocked by admin
type BlockedDate struct {
	ID        string    `dynamodbav:"id"`
	VillaID   string    `dynamodbav:"villaId"`
	StartDate time.Time `dynamodbav:"startDate"`
	EndDate   time.Time `dynamodbav:"endDate"`
	Reason    string    `dynamodbav:"reason"`
	CreatedAt time.Time `dynamodbav:"createdAt"`
}

// Offer represents coupon codes
type Offer struct {
	Code        string    `dynamodbav:"code"`
	Discount    int       `dynamodbav:"discount"` // Percentage or fixed amount
	Type        string    `dynamodbav:"type"`     // PERCENTAGE, FIXED
	MinAmount   int       `dynamodbav:"minAmount"`
	ValidTill   time.Time `dynamodbav:"validTill"`
	IsActive    bool      `dynamodbav:"isActive"`
}

// Payment represents Razorpay payment tracking
type Payment struct {
	ID            string    `dynamodbav:"id"`
	BookingID     string    `dynamodbav:"bookingId"`
	RazorpayOrderID string  `dynamodbav:"razorpayOrderId"`
	RazorpayPaymentID string `dynamodbav:"razorpayPaymentID"`
	Amount        int       `dynamodbav:"amount"`
	Currency      string    `dynamodbav:"currency"`
	Status        string    `dynamodbav:"status"` // CREATED, CAPTURED, FAILED
	CreatedAt     time.Time `dynamodbav:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt"`
}
