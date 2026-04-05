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
	"stayxl-backend/internal/email"
	"stayxl-backend/internal/models"

	"github.com/aws/aws-lambda-go/events"
)

// AppHandler holds dependencies for HTTP handlers
type AppHandler struct {
	DB    *db.DynamoClient
	Email *email.EmailService
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

	// Robust normalization: If path starts with /something/api/... or /something/health
	// strip the "something" (the stage name)
	parts := strings.Split(strings.TrimPrefix(p, "/"), "/")
	if len(parts) > 1 && (parts[0] != "api" && parts[0] != "health") && (parts[1] == "api" || parts[1] == "health") {
		p = "/" + strings.Join(parts[1:], "/")
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

	// ─── ADMIN ROUTES ───
	case finalPath == "/api/admin/block-dates" && method == http.MethodPost:
		return h.handleAdminBlockDates(ctx, req)
	case finalPath == "/api/admin/block-dates" && method == http.MethodGet:
		return h.handleAdminListBlockedDates(ctx, req)
	case strings.HasPrefix(finalPath, "/api/admin/block-dates/") && method == http.MethodDelete:
		return h.handleAdminUnblockDates(ctx, req, finalPath)
	case finalPath == "/api/admin/pricing" && method == http.MethodPost:
		return h.handleAdminSetDatePrice(ctx, req)
	case finalPath == "/api/admin/pricing" && method == http.MethodGet:
		return h.handleAdminListDatePricing(ctx, req)
	case strings.HasPrefix(finalPath, "/api/admin/pricing/") && method == http.MethodDelete:
		return h.handleAdminDeleteDatePrice(ctx, req, finalPath)
	case strings.HasPrefix(finalPath, "/api/admin/villas/") && strings.HasSuffix(finalPath, "/price") && method == http.MethodPut:
		return h.handleAdminUpdateBasePrice(ctx, req, finalPath)

	default:
		return errorResponse(http.StatusNotFound, fmt.Sprintf("Endpoint not found: %s (Method: %s, RawPath: %s)", finalPath, method, rawPath))
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
	// Robust lookup: try ID first, then Slug
	villa, _ := h.DB.GetVilla(ctx, body.VillaID)
	if villa == nil {
		villa, _ = h.DB.GetVillaBySlug(ctx, body.VillaID)
	}
	
	if villa == nil {
		return errorResponse(http.StatusNotFound, "Villa not found for booking: "+body.VillaID)
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
	
	// 3. Handle Coupon Discount
	discountAmount := 0
	if body.CouponCode != "" {
		offer, err := h.DB.GetOfferByCode(ctx, body.CouponCode)
		if err == nil && offer != nil && offer.IsActive {
			// Basic validation: min amount
			if baseAmount+addonAmount >= offer.MinAmount {
				if offer.Type == "PERCENTAGE" {
					discountAmount = int(float64(baseAmount) * float64(offer.Discount) / 100.0)
				} else {
					discountAmount = offer.Discount
				}
			}
		}
	}

	// 4. Calculate Taxes and Total
	taxableAmount := baseAmount + addonAmount - discountAmount
	if taxableAmount < 0 {
		taxableAmount = 0
	}
	taxAmount := int(float64(taxableAmount) * 0.18)
	securityDeposit := villa.Pricing.SecurityDeposit
	totalAmount := taxableAmount + taxAmount + securityDeposit

	// 5. Handle Advance Payment Mode
	advanceAmount := totalAmount
	if body.PaymentMode == "ADVANCE" {
		// 30% of stay (taxable + tax) + 100% of security deposit
		stayAmount := totalAmount - securityDeposit
		advanceStayAmount := int(float64(stayAmount) * 0.30)
		advanceAmount = advanceStayAmount + securityDeposit
	}
	balanceAmount := totalAmount - advanceAmount

	// 6. Prepare booking record
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
		GuestEmail:    body.GuestEmail,
		BaseAmount:     baseAmount,
		DiscountAmount: discountAmount,
		TaxAmount:      taxAmount,
		SecurityDeposit: securityDeposit,
		TotalAmount:    totalAmount,
		AdvanceAmount:  advanceAmount,
		BalanceAmount:  balanceAmount,
		Addons:         body.Addons,
		PaymentMode:   body.PaymentMode,
		CouponCode:     body.CouponCode,
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

	// Send confirmation email asynchronously
	if h.Email != nil {
		booking, err := h.DB.GetBooking(ctx, body.BookingID)
		if err == nil {
			go func() {
				// Create a new context for the background send
				sendCtx := context.Background()
				h.Email.SendBookingConfirmation(sendCtx, *booking)
			}()
		}
	}

	return successResponse(map[string]string{"message": "Payment verified and booking confirmed"})
}

// ─── ADMIN HANDLERS ───

const adminKey = "stayxl-admin-secret-2026"

func checkAdminAuth(req events.APIGatewayProxyRequest) error {
	key := req.Headers["x-admin-key"]
	if key == "" {
		key = req.Headers["X-Admin-Key"]
	}
	if key != adminKey {
		return fmt.Errorf("unauthorized")
	}
	return nil
}

func (h *AppHandler) handleAdminBlockDates(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	var body models.AdminBlockDateRequest
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	startDate, err1 := time.Parse("2006-01-02", body.StartDate)
	endDate, err2 := time.Parse("2006-01-02", body.EndDate)
	if err1 != nil || err2 != nil {
		return errorResponse(http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD")
	}

	bd := &models.BlockedDate{
		ID:        "block_" + time.Now().Format("20060102150405"),
		VillaID:   body.VillaID,
		StartDate: startDate,
		EndDate:   endDate,
		Reason:    body.Reason,
		CreatedAt: time.Now(),
	}

	if err := h.DB.SaveBlockedDate(ctx, bd); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to block dates: "+err.Error())
	}

	return successResponse(bd)
}

func (h *AppHandler) handleAdminListBlockedDates(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	villaID := req.QueryStringParameters["villaId"]
	if villaID == "" {
		return errorResponse(http.StatusBadRequest, "villaId is required")
	}

	dates, err := h.DB.GetBlockedDatesByVilla(ctx, villaID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(dates)
}

func (h *AppHandler) handleAdminUnblockDates(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	parts := strings.Split(normalizedPath, "/")
	if len(parts) < 5 {
		return errorResponse(http.StatusBadRequest, "Block ID is required")
	}
	blockID := parts[4]

	if err := h.DB.DeleteBlockedDate(ctx, blockID); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to unblock dates: "+err.Error())
	}

	return successResponse(map[string]string{"message": "Dates unblocked", "id": blockID})
}

func (h *AppHandler) handleAdminSetDatePrice(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	var body models.AdminPriceOverrideRequest
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if body.Price <= 0 {
		return errorResponse(http.StatusBadRequest, "Price must be positive")
	}

	dp := &models.DatePricing{
		ID:        "price_" + time.Now().Format("20060102150405"),
		VillaID:   body.VillaID,
		Date:      body.Date,
		Price:     body.Price,
		Reason:    body.Reason,
		CreatedAt: time.Now(),
	}

	if err := h.DB.SaveDatePricing(ctx, dp); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to set date price: "+err.Error())
	}

	return successResponse(dp)
}

func (h *AppHandler) handleAdminListDatePricing(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	villaID := req.QueryStringParameters["villaId"]
	if villaID == "" {
		return errorResponse(http.StatusBadRequest, "villaId is required")
	}

	pricing, err := h.DB.GetDatePricingByVilla(ctx, villaID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return successResponse(pricing)
}

func (h *AppHandler) handleAdminDeleteDatePrice(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	parts := strings.Split(normalizedPath, "/")
	if len(parts) < 5 {
		return errorResponse(http.StatusBadRequest, "Pricing ID is required")
	}
	pricingID := parts[4]

	if err := h.DB.DeleteDatePricing(ctx, pricingID); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to delete pricing: "+err.Error())
	}

	return successResponse(map[string]string{"message": "Date pricing removed", "id": pricingID})
}

func (h *AppHandler) handleAdminUpdateBasePrice(ctx context.Context, req events.APIGatewayProxyRequest, normalizedPath string) (events.APIGatewayProxyResponse, error) {
	if err := checkAdminAuth(req); err != nil {
		return errorResponse(http.StatusUnauthorized, "Unauthorized")
	}

	// Extract villaId from /api/admin/villas/{villaId}/price
	parts := strings.Split(normalizedPath, "/")
	if len(parts) < 5 {
		return errorResponse(http.StatusBadRequest, "Villa ID is required")
	}
	villaID := parts[4]

	var body models.AdminUpdateBasePriceRequest
	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if body.Price <= 0 {
		return errorResponse(http.StatusBadRequest, "Price must be positive")
	}

	if err := h.DB.UpdateVillaPrice(ctx, villaID, body.Price); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to update price: "+err.Error())
	}

	return successResponse(map[string]interface{}{"message": "Base price updated", "villaId": villaID, "newPrice": body.Price})
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
