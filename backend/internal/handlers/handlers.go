package handlers

import (
	"context"
	"encoding/json"
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
	case path == "/health" || path == "/api/health":
		return h.handleHealth(ctx, req)
	case strings.HasPrefix(path, "/api/villas") && strings.HasSuffix(path, "/availability"):
		return h.handleVillaAvailability(ctx, req)
	case strings.HasPrefix(path, "/api/villas"):
		return h.handleVillas(ctx, req)
	case path == "/api/bookings" && method == http.MethodPost:
		return h.handleCreateBooking(ctx, req)
	case strings.HasPrefix(path, "/api/offers/validate"):
		return h.handleValidateOffer(ctx, req)
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

// ─── VILLA HANDLERS ───

func (h *AppHandler) handleVillas(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// For listing, we could return minimal data from Dynamo or just a success
	return successResponse(map[string]interface{}{"message": "Villa listing handled by frontend static data"})
}

func (h *AppHandler) handleVillaAvailability(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Extract slug from path /api/villas/[slug]/availability
	parts := strings.Split(path.Clean(req.Path), "/")
	if len(parts) < 4 {
		return errorResponse(http.StatusBadRequest, "Invalid villa slug")
	}
	slug := parts[3]

	startDateStr := req.QueryStringParameters["startDate"]
	endDateStr := req.QueryStringParameters["endDate"]

	if startDateStr == "" || endDateStr == "" {
		return errorResponse(http.StatusBadRequest, "Dates are required")
	}

	start, _ := time.Parse(time.RFC3339, startDateStr)
	end, _ := time.Parse(time.RFC3339, endDateStr)

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
	var booking models.Booking
	if err := json.Unmarshal([]byte(req.Body), &booking); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid booking data")
	}
	
	booking.ID = "book_" + time.Now().Format("20060102150405")
	booking.Status = "PENDING"
	booking.CreatedAt = time.Now()

	if err := h.DB.SaveBooking(ctx, &booking); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to save booking")
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
