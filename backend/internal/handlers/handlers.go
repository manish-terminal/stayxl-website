package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"strings"
	"time"

	"stayxl-backend/internal/db"
	"stayxl-backend/internal/models"

	"github.com/aws/aws-lambda-go/events"
)

// AppHandler holds dependencies for HTTP handlers
type AppHandler struct {
	DB *db.DynamoClient
}

// HandleRequest routes incoming APIGateway requests to specific handlers
func (h *AppHandler) HandleRequest(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	path := req.Path
	method := req.HTTPMethod

	// CORS Preflight
	if method == http.MethodOptions {
		return response(http.StatusNoContent, nil)
	}

	switch {
	case strings.HasPrefix(path, "/api/auth/send-otp"):
		return h.handleSendOTP(ctx, req)
	case strings.HasPrefix(path, "/api/auth/verify-otp"):
		return h.handleVerifyOTP(ctx, req)
	case path == "/api/auth/me":
		return h.handleAuthMe(ctx, req)
	case path == "/health" || path == "/api/health":
		return h.handleHealth(ctx, req)
	case strings.HasPrefix(path, "/api/villas") && strings.HasSuffix(path, "/unavailable-dates"):
		return h.handleUnavailableDates(ctx, req)
	case strings.HasPrefix(path, "/api/villas") && strings.HasSuffix(path, "/availability"):
		return h.handleVillaAvailability(ctx, req)
	case strings.HasPrefix(path, "/api/villas"):
		return h.handleVillas(ctx, req)
	case path == "/api/bookings" && method == http.MethodPost:
		return h.handleCreateBooking(ctx, req)
	case path == "/api/bookings" && method == http.MethodGet:
		return h.handleListBookings(ctx, req)
	case strings.HasPrefix(path, "/api/offers/validate"):
		return h.handleValidateOffer(ctx, req)
	case path == "/api/offers" && method == http.MethodGet:
		return h.handleListOffers(ctx, req)
	case strings.HasPrefix(path, "/api/payments/create-order"):
		return h.handleCreatePaymentOrder(ctx, req)
	case strings.HasPrefix(path, "/api/payments/verify"):
		return h.handleVerifyPayment(ctx, req)
	default:
		return errorResponse(http.StatusNotFound, "Endpoint not found")
	}
}

// ─── SYSTEM HANDLERS ───

func (h *AppHandler) handleHealth(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return successResponse(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"version":   "1.0.0",
	})
}

// ─── AUTH HANDLERS ───

func (h *AppHandler) handleSendOTP(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var body struct {
		Phone string `json:"phone"`
	}
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid phone number")
	}
	// In production: Send real SMS via AWS SNS or 2Factor
	return successResponse(map[string]string{"message": "OTP sent successfully (Mock: 123456)"})
}

func (h *AppHandler) handleVerifyOTP(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var body struct {
		Phone string `json:"phone"`
		OTP   string `json:"otp"`
	}
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request")
	}

	if body.OTP != "123456" {
		return errorResponse(http.StatusUnauthorized, "Invalid OTP")
	}

	// Mock User & JWT
	user := models.User{
		ID:    "mock-user-123",
		Phone: &body.Phone,
		Role:  "USER",
	}
	
	return successResponse(map[string]interface{}{
		"user":  user,
		"token": "mock-jwt-token",
		"message": "Login successful",
	})
}

func (h *AppHandler) handleAuthMe(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// In production: decode JWT from Authorization header and return user
	// For now, return a stub response
	token := req.Headers["authorization"]
	if token == "" {
		return errorResponse(http.StatusUnauthorized, "No authorization token provided")
	}

	return successResponse(map[string]interface{}{
		"id":    "mock-user-123",
		"phone": "9876543210",
		"role":  "USER",
	})
}

// ─── VILLA HANDLERS ───

func (h *AppHandler) handleVillas(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// For listing, we could return minimal data from Dynamo or just a success
	return successResponse(map[string]interface{}{"message": "Villa listing handled by frontend static data"})
}

func (h *AppHandler) handleUnavailableDates(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	parts := strings.Split(path.Clean(req.Path), "/")
	if len(parts) < 4 {
		return errorResponse(http.StatusBadRequest, "Invalid villa slug")
	}
	slug := parts[3]

	villa, _ := h.DB.GetVillaBySlug(ctx, slug)
	if villa == nil {
		return errorResponse(http.StatusNotFound, "Villa not found")
	}

	dates, err := h.DB.GetUnavailableDates(ctx, villa.ID, time.Now(), time.Now().AddDate(1, 0, 0))
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(dates)
}

func (h *AppHandler) handleListBookings(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userID := req.QueryStringParameters["userId"]
	if userID == "" {
		return errorResponse(http.StatusBadRequest, "userId (phone) is required")
	}

	bookings, err := h.DB.GetBookingsByUser(ctx, userID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(bookings)
}

func (h *AppHandler) handleListOffers(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	offers, err := h.DB.GetAllOffers(ctx)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(offers)
}

func (h *AppHandler) handleVillaAvailability(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Extract slug from path /api/villas/[slug]/availability
	parts := strings.Split(path.Clean(req.Path), "/")
	if len(parts) < 4 {
		return errorResponse(http.StatusBadRequest, "Invalid villa slug")
	}
	slug := parts[3]

	startDateStr := req.QueryStringParameters["startDate"]
	if startDateStr == "" {
		startDateStr = req.QueryStringParameters["checkIn"]
	}
	endDateStr := req.QueryStringParameters["endDate"]
	if endDateStr == "" {
		endDateStr = req.QueryStringParameters["checkOut"]
	}

	if startDateStr == "" || endDateStr == "" {
		return errorResponse(http.StatusBadRequest, "Dates are required (startDate/checkIn and endDate/checkOut)")
	}

	// Helper to handle both ISO and simple date formats
	parseDate := func(s string) (time.Time, error) {
		if strings.Contains(s, "T") {
			return time.Parse(time.RFC3339, s)
		}
		return time.Parse("2006-01-02", s)
	}

	start, errStart := parseDate(startDateStr)
	end, errEnd := parseDate(endDateStr)

	if errStart != nil || errEnd != nil {
		return errorResponse(http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD or ISO8601")
	}

	villa, _ := h.DB.GetVillaBySlug(ctx, slug)
	if villa == nil {
		return errorResponse(http.StatusNotFound, "Villa not found in database")
	}

	available, err := h.DB.CheckAvailability(ctx, villa.ID, start, end)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(map[string]bool{"available": available})
}

// ─── BOOKING & PAYMENT HANDLERS ───

func (h *AppHandler) handleCreateBooking(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var body models.BookingRequest
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		fmt.Printf("Unmarshal error: %v\n", err)
		return errorResponse(http.StatusBadRequest, "Invalid booking data format")
	}

	// Helper to parse dates
	parseDate := func(s string) (time.Time, error) {
		if strings.Contains(s, "T") {
			return time.Parse(time.RFC3339, s)
		}
		return time.Parse("2006-01-02", s)
	}

	checkIn, errIn := parseDate(body.CheckIn)
	checkOut, errOut := parseDate(body.CheckOut)
	if errIn != nil || errOut != nil {
		return errorResponse(http.StatusBadRequest, "Invalid date format in booking")
	}

	// Calculate total amount (simplified for MVP)
	// In production: Fetch villa from DB to get real pricePerNight
	totalAmount := 0
	for _, addon := range body.Addons {
		totalAmount += addon.Price * addon.Quantity
	}
	
	// Use phone number as userId
	userID := body.GuestPhone
	
	booking := models.Booking{
		ID:            "book_" + time.Now().Format("20060102150405"),
		UserID:        userID,
		VillaID:       body.VillaID,
		CheckIn:       checkIn,
		CheckOut:      checkOut,
		Guests:        body.Guests,
		GuestName:     body.GuestName,
		GuestPhone:    body.GuestPhone,
		Addons:        body.Addons,
		PaymentMode:   body.PaymentMode,
		Status:        "PENDING",
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		TotalAmount:   totalAmount,
	}

	if err := h.DB.SaveBooking(ctx, &booking); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to save booking: "+err.Error())
	}

	return successResponse(booking)
}

func (h *AppHandler) handleValidateOffer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	code := req.QueryStringParameters["code"]
	offer, err := h.DB.GetOfferByCode(ctx, code)
	if err != nil || offer == nil {
		return errorResponse(http.StatusNotFound, "Invalid coupon code")
	}
	return successResponse(offer)
}

func (h *AppHandler) handleCreatePaymentOrder(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// In production: Call Razorpay API here
	orderID := "order_" + time.Now().Format("20060102150405")
	return successResponse(map[string]string{
		"id": orderID,
		"status": "created",
	})
}

func (h *AppHandler) handleVerifyPayment(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// In production: Verify Razorpay signature
	return successResponse(map[string]string{"message": "Payment verified successfully"})
}

// ─── HELPERS ───

func successResponse(data interface{}) (events.APIGatewayProxyResponse, error) {
	return response(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    data,
	})
}

func errorResponse(statusCode int, message string) (events.APIGatewayProxyResponse, error) {
	return response(statusCode, map[string]interface{}{
		"success": false,
		"error":   message,
	})
}

func response(statusCode int, body interface{}) (events.APIGatewayProxyResponse, error) {
	jsonBody, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       string(jsonBody),
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type,Authorization,X-Requested-With",
		},
	}, nil
}
