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
	
	// Fetch JWT and Admin Secrets from AWS Secrets Manager
	jwtSecret := os.Getenv("JWT_SECRET") 
	adminKey := os.Getenv("ADMIN_KEY")

	if jwtSecret == "" || adminKey == "" {
		secretID := os.Getenv("STAYXL_SECRET_ID")
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
						if jwtSecret == "" {
							jwtSecret = secretData["JWT_SECRET"]
						}
						if adminKey == "" {
							adminKey = secretData["ADMIN_KEY"]
						}
					} else if jwtSecret == "" {
						jwtSecret = *out.SecretString
					}
				}
			}
		}
	}

	app := &handlers.AppHandler{
		DB:        dbClient,
		Email:     emailService,
		JWTSecret: jwtSecret,
		AdminKey:  adminKey,
	}

	// Start Lambda function
	lambda.Start(app.HandleRequest)
}
