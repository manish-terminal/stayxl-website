package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// Offer matches the backend model schema exactly
type Offer struct {
	Code      string    `dynamodbav:"code"`
	Discount  int       `dynamodbav:"discount"` // Percentage or fixed amount
	Type      string    `dynamodbav:"type"`     // PERCENTAGE, FIXED
	MinAmount int       `dynamodbav:"minAmount"`
	ValidTill time.Time `dynamodbav:"validTill"`
	IsActive  bool      `dynamodbav:"isActive"`
}

func main() {
	ctx := context.TODO()
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("ap-south-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	client := dynamodb.NewFromConfig(cfg)
	tableName := "StayXLOffers"
	now := time.Now()

	offers := []Offer{
		{
			Code:      "WELCOME10",
			Discount:  10,
			Type:      "PERCENTAGE",
			MinAmount: 5000,
			ValidTill: now.AddDate(1, 0, 0),
			IsActive:  true,
		},
		{
			Code:      "STAYXL5000",
			Discount:  5000,
			Type:      "FIXED",
			MinAmount: 20000,
			ValidTill: now.AddDate(0, 3, 0),
			IsActive:  true,
		},
		{
			Code:      "SUMMER2026",
			Discount:  20,
			Type:      "PERCENTAGE",
			MinAmount: 10000,
			ValidTill: time.Date(2026, 6, 30, 23, 59, 59, 0, time.UTC),
			IsActive:  true,
		},
	}

	fmt.Printf("Seeding %d offers into %s...\n\n", len(offers), tableName)

	for _, offer := range offers {
		item, err := attributevalue.MarshalMap(offer)
		if err != nil {
			log.Printf("❌ Failed to marshal offer %s: %v", offer.Code, err)
			continue
		}

		_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
			TableName: aws.String(tableName),
			Item:      item,
		})
		if err != nil {
			log.Printf("❌ Failed to seed %s: %v", offer.Code, err)
		} else {
			fmt.Printf("✅ %s | %d (%s) | Min: ₹%d\n",
				offer.Code, offer.Discount, offer.Type, offer.MinAmount)
		}
	}

	fmt.Println("\n🎉 Seeding complete!")
}
