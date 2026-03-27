package models

import "time"

// User represents the User entity in the system
type User struct {
	ID            string    `dynamodbav:"id" json:"id"`
	Email         string    `dynamodbav:"email" json:"email"`
	Name          *string   `dynamodbav:"name,omitempty" json:"name,omitempty"`
	Phone         *string   `dynamodbav:"phone,omitempty" json:"phone,omitempty"`
	Role          string    `dynamodbav:"role" json:"role"`
	EmailVerified bool      `dynamodbav:"emailVerified" json:"emailVerified"`
	CreatedAt     time.Time `dynamodbav:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt" json:"updatedAt"`
}

// Villa represents the Villa entity in the system
type Villa struct {
	ID            string    `dynamodbav:"id" json:"id"`
	Slug          string    `dynamodbav:"slug" json:"slug"`
	Name          string    `dynamodbav:"name" json:"name"`
	Location      string    `dynamodbav:"location" json:"location"`
	PricePerNight int       `dynamodbav:"pricePerNight" json:"pricePerNight"`
	Guests        int       `dynamodbav:"guests" json:"guests"`
	BedroomCount  int       `dynamodbav:"bedroomCount" json:"bedroomCount"`
	BathroomCount int       `dynamodbav:"bathroomCount" json:"bathroomCount"`
	IsActive      bool      `dynamodbav:"isActive" json:"isActive"`
	Pricing       Pricing   `dynamodbav:"pricing" json:"pricing"`
	CreatedAt     time.Time `dynamodbav:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt" json:"updatedAt"`
}

type Pricing struct {
	SecurityDeposit  int `dynamodbav:"securityDeposit" json:"securityDeposit"`
	KitchenAccessFee int `dynamodbav:"kitchenAccessFee" json:"kitchenAccessFee"`
}

// Booking represents the Booking entity in the system
type Booking struct {
	ID             string    `dynamodbav:"id" json:"id"`
	UserID         string    `dynamodbav:"userId" json:"userId"`
	VillaID        string    `dynamodbav:"villaId" json:"villaId"`
	VillaSlug      string    `dynamodbav:"villaSlug" json:"villaSlug"`
	CheckIn        time.Time `dynamodbav:"checkIn" json:"checkIn"`
	CheckOut       time.Time `dynamodbav:"checkOut" json:"checkOut"`
	Guests         int       `dynamodbav:"guests" json:"guests"`
	GuestName      string    `dynamodbav:"guestName" json:"guestName"`
	GuestPhone     string    `dynamodbav:"guestPhone" json:"guestPhone"`
	BaseAmount     int       `dynamodbav:"baseAmount" json:"baseAmount"`
	DiscountAmount int       `dynamodbav:"discountAmount" json:"discountAmount"`
	TotalAmount    int       `dynamodbav:"totalAmount" json:"totalAmount"`
	TaxAmount      int       `dynamodbav:"taxAmount" json:"taxAmount"`
	SecurityDeposit int      `dynamodbav:"securityDeposit" json:"securityDeposit"`
	AdvanceAmount  int       `dynamodbav:"advanceAmount" json:"advanceAmount"`
	BalanceAmount  int       `dynamodbav:"balanceAmount" json:"balanceAmount"`
	Status         string    `dynamodbav:"status" json:"status"` // PENDING, CONFIRMED, CANCELLED
	PaymentID      string    `dynamodbav:"paymentId,omitempty" json:"paymentId,omitempty"`
	PaymentMode    string    `dynamodbav:"paymentMode" json:"paymentMode"`
	CouponCode     string    `dynamodbav:"couponCode,omitempty" json:"couponCode,omitempty"`
	VillaName      string    `dynamodbav:"villaName,omitempty" json:"villaName,omitempty"`
	VillaLocation  string    `dynamodbav:"villaLocation,omitempty" json:"villaLocation,omitempty"`
	Addons         []Addon   `dynamodbav:"addons" json:"addons"`
	CreatedAt      time.Time `dynamodbav:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time `dynamodbav:"updatedAt" json:"updatedAt"`
}

type Addon struct {
	Name     string `json:"name" dynamodbav:"name"`
	Price    int    `json:"price" dynamodbav:"price"`
	Quantity int    `json:"quantity" dynamodbav:"quantity"`
}

// BookingRequest represents the incoming JSON from frontend
type BookingRequest struct {
	VillaID     string  `json:"villaId"`
	CheckIn     string  `json:"checkIn"`
	CheckOut    string  `json:"checkOut"`
	Guests      int     `json:"guests"`
	GuestName   string  `json:"guestName"`
	GuestPhone  string  `json:"guestPhone"`
	Addons          []Addon `json:"addons"`
	PaymentMode     string  `json:"paymentMode"`
	CouponCode      string  `json:"couponCode,omitempty"`
	SpecialRequests string  `json:"specialRequests,omitempty"`
}

// BlockedDate represents dates blocked by admin
type BlockedDate struct {
	ID        string    `dynamodbav:"id" json:"id"`
	VillaID   string    `dynamodbav:"villaId" json:"villaId"`
	StartDate time.Time `dynamodbav:"startDate" json:"startDate"`
	EndDate   time.Time `dynamodbav:"endDate" json:"endDate"`
	Reason    string    `dynamodbav:"reason" json:"reason"`
	CreatedAt time.Time `dynamodbav:"createdAt" json:"createdAt"`
}

// Offer represents coupon codes
type Offer struct {
	Code      string    `dynamodbav:"code" json:"code"`
	Discount  int       `dynamodbav:"discount" json:"discount"`
	Type      string    `dynamodbav:"type" json:"type"`
	MinAmount int       `dynamodbav:"minAmount" json:"minAmount"`
	ValidTill time.Time `dynamodbav:"validTill" json:"validTill"`
	IsActive  bool      `dynamodbav:"isActive" json:"isActive"`
}

// Payment represents Razorpay payment tracking
type Payment struct {
	ID                string    `dynamodbav:"id" json:"id"`
	BookingID         string    `dynamodbav:"bookingId" json:"bookingId"`
	RazorpayOrderID   string    `dynamodbav:"razorpayOrderId" json:"razorpayOrderId"`
	RazorpayPaymentID string    `dynamodbav:"razorpayPaymentID" json:"razorpayPaymentID"`
	Amount            int       `dynamodbav:"amount" json:"amount"`
	Currency          string    `dynamodbav:"currency" json:"currency"`
	Status            string    `dynamodbav:"status" json:"status"` // CREATED, CAPTURED, FAILED
	CreatedAt         time.Time `dynamodbav:"createdAt" json:"createdAt"`
	UpdatedAt         time.Time `dynamodbav:"updatedAt" json:"updatedAt"`
}
