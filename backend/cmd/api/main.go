package main

import (
	"context"
	"log"

	"stayxl-backend/internal/db"
	"stayxl-backend/internal/handlers"

	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	ctx := context.Background()

	// Initialize DynamoDB Client
	dbClient, err := db.NewDynamoClient(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize database client: %v", err)
	}

	// Initialize App Handler
	app := &handlers.AppHandler{
		DB: dbClient,
	}

	// Start Lambda function
	lambda.Start(app.HandleRequest)
}
