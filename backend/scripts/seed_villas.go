package main

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type Image struct {
	URL     string `dynamodbav:"url"`
	Caption string `dynamodbav:"caption"`
}

type Villa struct {
	ID            string   `dynamodbav:"id"`
	Slug          string   `dynamodbav:"slug"`
	Name          string   `dynamodbav:"name"`
	Location      string   `dynamodbav:"location"`
	PricePerNight float64  `dynamodbav:"pricePerNight"`
	Rating        float64  `dynamodbav:"rating"`
	ReviewCount   int      `dynamodbav:"reviewCount"`
	IsFeatured    bool     `dynamodbav:"isFeatured"`
	Images        []Image  `dynamodbav:"images"`
}

func main() {
	ctx := context.TODO()
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("ap-south-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	client := dynamodb.NewFromConfig(cfg)
	tableName := "StayXLVillas"

	villas := []Villa{
		{
			ID: "v1", Slug: "the-ivory-manor", Name: "The Ivory Manor", Location: "Kasauli, HP", PricePerNight: 18500, Rating: 4.9, ReviewCount: 127, IsFeatured: true,
			Images: []Image{
				{URL: "https://images.unsplash.com/photo-1613490493576-7fde63acd811", Caption: "Main Entrance"},
			},
		},
		{
			ID: "v2", Slug: "villa-del-sol", Name: "Villa del Sol", Location: "Alibaug, MH", PricePerNight: 24000, Rating: 4.8, ReviewCount: 94, IsFeatured: true,
			Images: []Image{
				{URL: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf", Caption: "Pool View"},
			},
		},
	}

	for _, villa := range villas {
		item, err := attributevalue.MarshalMap(villa)
		if err != nil {
			log.Printf("Failed to marshal villa %s: %v", villa.Name, err)
			continue
		}

		_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
			TableName: aws.String(tableName),
			Item:      item,
		})
		if err != nil {
			log.Printf("Failed to put item %s: %v", villa.Name, err)
		} else {
			fmt.Printf("Successfully added %s\n", villa.Name)
		}
	}
}
