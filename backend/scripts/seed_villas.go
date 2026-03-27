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

// Villa matches the backend model schema exactly
type Villa struct {
	ID            string    `dynamodbav:"id"`
	Slug          string    `dynamodbav:"slug"`
	Name          string    `dynamodbav:"name"`
	Location      string    `dynamodbav:"location"`
	PricePerNight int       `dynamodbav:"pricePerNight"`
	Guests        int       `dynamodbav:"guests"`
	BedroomCount  int       `dynamodbav:"bedroomCount"`
	BathroomCount int       `dynamodbav:"bathroomCount"`
	IsActive      bool      `dynamodbav:"isActive"`
	CreatedAt     time.Time `dynamodbav:"createdAt"`
	UpdatedAt     time.Time `dynamodbav:"updatedAt"`
}

func main() {
	ctx := context.TODO()
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("ap-south-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	client := dynamodb.NewFromConfig(cfg)
	tableName := "StayXLVillas"
	now := time.Now()

	// ─── ALL VILLAS (matched 1:1 with frontend app/data/villas.ts) ───
	villas := []Villa{
		{
			ID:            "v-ivory",
			Slug:          "the-ivory-manor",
			Name:          "The Ivory Manor",
			Location:      "Kasauli, Himachal Pradesh",
			PricePerNight: 18500,
			Guests:        8,
			BedroomCount:  4,
			BathroomCount: 3,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
		{
			ID:            "v-delsol",
			Slug:          "villa-del-sol",
			Name:          "Villa del Sol",
			Location:      "Alibaug, Maharashtra",
			PricePerNight: 24000,
			Guests:        12,
			BedroomCount:  6,
			BathroomCount: 5,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
		{
			ID:            "v-chateau",
			Slug:          "the-grand-chateau",
			Name:          "The Grand Chateau",
			Location:      "North Goa",
			PricePerNight: 32000,
			Guests:        16,
			BedroomCount:  8,
			BathroomCount: 6,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
		{
			ID:            "v-serenity",
			Slug:          "serenity-heights",
			Name:          "Serenity Heights",
			Location:      "Lonavala, Maharashtra",
			PricePerNight: 15200,
			Guests:        6,
			BedroomCount:  3,
			BathroomCount: 2,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
		{
			ID:            "v-woodland",
			Slug:          "woodland-retreat",
			Name:          "Woodland Retreat",
			Location:      "Coorg, Karnataka",
			PricePerNight: 12800,
			Guests:        4,
			BedroomCount:  2,
			BathroomCount: 2,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
		{
			ID:            "v-azure",
			Slug:          "azure-bay-estate",
			Name:          "Azure Bay Estate",
			Location:      "Kochi, Kerala",
			PricePerNight: 28500,
			Guests:        10,
			BedroomCount:  5,
			BathroomCount: 4,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
		{
			ID:            "v-samaya",
			Slug:          "samaya-villa-hyderabad",
			Name:          "Samaya",
			Location:      "Hyderabad",
			PricePerNight: 45000,
			Guests:        14,
			BedroomCount:  4,
			BathroomCount: 3,
			IsActive:      true,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
	}

	fmt.Printf("Seeding %d villas into %s...\n\n", len(villas), tableName)

	for _, villa := range villas {
		item, err := attributevalue.MarshalMap(villa)
		if err != nil {
			log.Printf("❌ Failed to marshal villa %s: %v", villa.Name, err)
			continue
		}

		_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
			TableName: aws.String(tableName),
			Item:      item,
		})
		if err != nil {
			log.Printf("❌ Failed to seed %s: %v", villa.Name, err)
		} else {
			fmt.Printf("✅ %s | slug: %s | ₹%d/night | %d guests | %dBR/%dBA\n",
				villa.Name, villa.Slug, villa.PricePerNight, villa.Guests, villa.BedroomCount, villa.BathroomCount)
		}
	}

	fmt.Println("\n🎉 Seeding complete!")
}
