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
	rawPath := req.Path
	method := req.HTTPMethod

	// Normalize path by stripping stage if present
	// API Gateway REST stage is typically the first part of the path
	p := path.Clean(rawPath)
	if !strings.HasPrefix(p, "/") {
		p = "/" + p
	}
	parts := strings.Split(p, "/")
	// If first part is "Prod" or other stage name, strip it
	// In SAM, the stage is typically "Prod"
	if len(parts) > 1 && (parts[1] == "Prod" || parts[1] == "dev" || parts[1] == "stage") {
		p = "/" + strings.Join(parts[2:], "/")
	}
	finalPath := p

	// CORS Preflight
	if method == http.MethodOptions {
		return response(http.StatusNoContent, nil)
	}

	switch {
	case strings.HasPrefix(finalPath, "/api/auth/send-otp"):
		return h.handleSendOTP(ctx, req)
	case strings.HasPrefix(finalPath, "/api/auth/verify-otp"):
		return h.handleVerifyOTP(ctx, req)
	case finalPath == "/api/auth/me":
		return h.handleAuthMe(ctx, req)
	case finalPath == "/health" || finalPath == "/api/health":
		return h.handleHealth(ctx, req)
	case strings.HasPrefix(finalPath, "/api/villas") && strings.HasSuffix(finalPath, "/unavailable-dates"):
		return h.handleUnavailableDates(ctx, req, finalPath)
	case strings.HasPrefix(finalPath, "/api/villas") && strings.HasSuffix(finalPath, "/availability"):
		return h.handleVillaAvailability(ctx, req, finalPath)
	case strings.HasPrefix(finalPath, "/api/villas"):
		return h.handleVillas(ctx, req, finalPath)
	case finalPath == "/api/bookings" && method == http.MethodPost:
		return h.handleCreateBooking(ctx, req)
	case strings.HasPrefix(finalPath, "/api/bookings/") && method == http.MethodGet:
		return h.handleGetBooking(ctx, req, finalPath)
	case finalPath == "/api/bookings" && method == http.MethodGet:
		return h.handleListBookings(ctx, req)
	case strings.HasPrefix(finalPath, "/api/offers/validate"):
		return h.handleValidateOffer(ctx, req)
	case finalPath == "/api/offers" && method == http.MethodGet:
		return h.handleListOffers(ctx, req)
	case strings.HasPrefix(finalPath, "/api/payments/create-order"):
		return h.handleCreatePaymentOrder(ctx, req)
	case strings.HasPrefix(finalPath, "/api/payments/verify"):
		return h.handleVerifyPayment(ctx, req)
	default:
		return errorResponse(http.StatusNotFound, "Endpoint not found: "+finalPath)
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

func (h *AppHandler) handleVillas(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	parts := strings.Split(normalizedPath, "/")
	if len(parts) > 3 {
		// Single villa
		slug := parts[3]
		villa, err := h.DB.GetVillaBySlug(ctx, slug)
		if err != nil {
			return errorResponse(http.StatusInternalServerError, err.Error())
		}
		if villa == nil {
			return errorResponse(http.StatusNotFound, "Villa not found: "+slug)
		}
		return successResponse(villa)
	}
	// Listing handled by frontend for now
	return successResponse(map[string]interface{}{"message": "Villa listing handled by frontend static data"})
}

func (h *AppHandler) handleUnavailableDates(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	parts := strings.Split(normalizedPath, "/")
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

func (h *AppHandler) handleGetBooking(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	parts := strings.Split(normalizedPath, "/")
	if len(parts) < 4 {
		return errorResponse(http.StatusBadRequest, "Invalid booking ID format")
	}
	bookingID := parts[3]

	booking, err := h.DB.GetBooking(ctx, bookingID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}
	if booking == nil {
		return errorResponse(http.StatusNotFound, "Booking not found: "+bookingID)
	}

	return successResponse(booking)
}

func (h *AppHandler) handleListOffers(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	offers, err := h.DB.GetAllOffers(ctx)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(offers)
}

func (h *AppHandler) handleVillaAvailability(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	// Extract slug from path /api/villas/[slug]/availability
	parts := strings.Split(normalizedPath, "/")
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

	// 1. Fetch villa to get real price and info
	var villa *models.Villa
	var err error
	if strings.HasPrefix(body.VillaID, "villa_") {
		villa, err = h.DB.GetVilla(ctx, body.VillaID)
	} else {
		villa, err = h.DB.GetVillaBySlug(ctx, body.VillaID)
	}
	if err != nil || villa == nil {
		return errorResponse(http.StatusNotFound, "Villa not found for booking")
	}

	// 2. Calculate nights and amounts
	nights := int(checkOut.Sub(checkIn).Hours() / 24)
	if nights < 1 {
		nights = 1
	}

	baseAmount := villa.PricePerNight * nights
	addonAmount := 0
	for _, addon := range body.Addons {
		addonAmount += addon.Price * addon.Quantity
	}
	
	// For MVP: assume no discount or handle simplistic coupon if needed
	totalAmount := baseAmount + addonAmount
	advanceAmount := totalAmount
	balanceAmount := 0
	if body.PaymentMode == "ADVANCE" {
		advanceAmount = int(float64(totalAmount) * 0.3)
		balanceAmount = totalAmount - advanceAmount
	}

	// 3. Prepare booking record
	userID := body.GuestPhone
	booking := models.Booking{
		ID:             "book_" + time.Now().Format("20060102150405"),
		UserID:         userID,
		VillaID:        villa.ID,
		VillaSlug:      villa.Slug,
		VillaName:      villa.Name,
		VillaLocation:  villa.Location,
		CheckIn:        checkIn,
		CheckOut:       checkOut,
		Guests:         body.Guests,
		GuestName:     body.GuestName,
		GuestPhone:    body.GuestPhone,
		BaseAmount:     baseAmount,
		TotalAmount:    totalAmount,
		AdvanceAmount:  advanceAmount,
		BalanceAmount:  balanceAmount,
		Addons:         body.Addons,
		PaymentMode:   body.PaymentMode,
		Status:         "PENDING",
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
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
	var body struct {
		BookingID string `json:"bookingId"`
		Status    string `json:"status"` // Should be 'CONFIRMED'
	}
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if body.BookingID == "" {
		return errorResponse(http.StatusBadRequest, "BookingID is required")
	}

	// Update booking status in DynamoDB
	err := h.DB.UpdateBookingStatus(ctx, body.BookingID, "CONFIRMED")
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to update booking status: "+err.Error())
	}

	return successResponse(map[string]string{"message": "Payment verified and booking confirmed"})
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
