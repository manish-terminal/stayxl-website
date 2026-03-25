package db

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// DynamoClient holds the DynamoDB client and table names
type DynamoClient struct {
	Client        *dynamodb.Client
	UsersTable    string
	VillasTable   string
	BookingsTable string
}

// NewDynamoClient initializes and returns a DynamoClient
func NewDynamoClient(ctx context.Context) (*DynamoClient, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to load SDK config: %v", err)
	}

	client := dynamodb.NewFromConfig(cfg)

	usersTable := os.Getenv("USERS_TABLE")
	if usersTable == "" {
		usersTable = "StayXLUsers"
	}

	villasTable := os.Getenv("VILLAS_TABLE")
	if villasTable == "" {
		villasTable = "StayXLVillas"
	}

	bookingsTable := os.Getenv("BOOKINGS_TABLE")
	if bookingsTable == "" {
		bookingsTable = "StayXLBookings"
	}

	return &DynamoClient{
		Client:        client,
		UsersTable:    usersTable,
		VillasTable:   villasTable,
		BookingsTable: bookingsTable,
	}, nil
}
