package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

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

	switch {
	case strings.HasPrefix(path, "/api/villas"):
		return h.handleVillas(ctx, req)
	case strings.HasPrefix(path, "/api/bookings"):
		return h.handleBookings(ctx, req)
	case strings.HasPrefix(path, "/api/users"):
		return h.handleUsers(ctx, req)
	default:
		return response(http.StatusNotFound, map[string]string{"error": "Not Found"})
	}
}

func (h *AppHandler) handleVillas(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod == http.MethodGet {
		// Mock implementation: In a real app, query DynamoDB here
		return response(http.StatusOK, map[string]string{"message": "List of villas from DynamoDB"})
	}
	return response(http.StatusMethodNotAllowed, map[string]string{"error": "Method Not Allowed"})
}

func (h *AppHandler) handleBookings(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod == http.MethodPost {
		var booking models.Booking
		if err := json.Unmarshal([]byte(req.Body), &booking); err != nil {
			return response(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}
		// Mock implementation: In a real app, insert mapping to DynamoDB here
		return response(http.StatusCreated, map[string]string{"message": "Booking created"})
	}
	return response(http.StatusMethodNotAllowed, map[string]string{"error": "Method Not Allowed"})
}

func (h *AppHandler) handleUsers(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod == http.MethodGet {
		// Mock implementation
		return response(http.StatusOK, map[string]string{"message": "User profile"})
	}
	return response(http.StatusMethodNotAllowed, map[string]string{"error": "Method Not Allowed"})
}

func response(statusCode int, body interface{}) (events.APIGatewayProxyResponse, error) {
	jsonBody, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       string(jsonBody),
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Headers": "Content-Type,Authorization",
		},
	}, nil
}
