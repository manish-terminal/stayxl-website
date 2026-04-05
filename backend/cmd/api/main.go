package main

import (
	"context"
	"encoding/json"
	"log"

	"stayxl-backend/internal/db"
	"stayxl-backend/internal/email"
	"stayxl-backend/internal/handlers"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

func main() {
	ctx := context.Background()

	// Initialize DynamoDB Client
	dbClient, err := db.NewDynamoClient(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize database client: %v", err)
	}

	// Initialize App Handler
	emailService, _ := email.NewEmailService(ctx, "bookings@stayxl.com") // Fallback if no env var, user should set up SES
	
	// Fetch Admin Secret from AWS Secrets Manager
	adminKey := os.Getenv("ADMIN_KEY") // Local dev override

	if adminKey == "" {
		secretID := os.Getenv("STAYXL_ADMIN_SECRET_ID")
		if secretID != "" {
			cfg, err := config.LoadDefaultConfig(ctx)
			if err == nil {
				svc := secretsmanager.NewFromConfig(cfg)
				out, err := svc.GetSecretValue(ctx, &secretsmanager.GetSecretValueInput{
					SecretId: aws.String(secretID),
				})
				if err == nil && out.SecretString != nil {
					var secretData map[string]string
					if err := json.Unmarshal([]byte(*out.SecretString), &secretData); err == nil {
						adminKey = secretData["ADMIN_KEY"]
					} else {
						adminKey = *out.SecretString
					}
				}
			}
		}
	}

	app := &handlers.AppHandler{
		DB:        dbClient,
		Email:     emailService,
		AdminKey:  adminKey,
	}

	// Start Lambda function
	lambda.Start(app.HandleRequest)
}
