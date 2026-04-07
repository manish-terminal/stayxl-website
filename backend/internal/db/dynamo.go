package db

import (
	"context"
	"fmt"
	"os"
	"time"

	"stayxl-backend/internal/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// GetVillaBySlug retrieves a villa by its slug using the SlugIndex
func (d *DynamoClient) GetVillaBySlug(ctx context.Context, slug string) (*models.Villa, error) {
	input := &dynamodb.QueryInput{
		TableName:              aws.String(d.VillasTable),
		IndexName:              aws.String("SlugIndex"),
		KeyConditionExpression: aws.String("slug = :slug"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":slug": &types.AttributeValueMemberS{Value: slug},
		},
	}

	result, err := d.Client.Query(ctx, input)
	if err != nil {
		return nil, err
	}

	if len(result.Items) == 0 {
		return nil, nil
	}

	var villa models.Villa
	err = attributevalue.UnmarshalMap(result.Items[0], &villa)
	return &villa, err
}

// GetVilla retrieves a villa by its ID
func (d *DynamoClient) GetVilla(ctx context.Context, id string) (*models.Villa, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String(d.VillasTable),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	}

	result, err := d.Client.GetItem(ctx, input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil
	}

	var villa models.Villa
	err = attributevalue.UnmarshalMap(result.Item, &villa)
	return &villa, err
}

// GetAllVillas retrieves all villas from the database
func (d *DynamoClient) GetAllVillas(ctx context.Context) ([]models.Villa, error) {
	input := &dynamodb.ScanInput{
		TableName: aws.String(d.VillasTable),
	}

	result, err := d.Client.Scan(ctx, input)
	if err != nil {
		return nil, err
	}

	var villas []models.Villa
	err = attributevalue.UnmarshalListOfMaps(result.Items, &villas)
	return villas, err
}

// GetOfferByCode retrieves an offer by its coupon code
func (d *DynamoClient) GetOfferByCode(ctx context.Context, code string) (*models.Offer, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String(d.OffersTable),
		Key: map[string]types.AttributeValue{
			"code": &types.AttributeValueMemberS{Value: code},
		},
	}

	result, err := d.Client.GetItem(ctx, input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil
	}

	var offer models.Offer
	err = attributevalue.UnmarshalMap(result.Item, &offer)
	return &offer, err
}

// CheckAvailability verifies if a villa is available for a given range
func (d *DynamoClient) CheckAvailability(ctx context.Context, villaID string, startDate, endDate time.Time) (bool, error) {
	// 1. Check existing confirmed bookings
	bookingInput := &dynamodb.QueryInput{
		TableName:              aws.String(d.BookingsTable),
		IndexName:              aws.String("VillaBookingsIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		FilterExpression:       aws.String("#status = :conf AND checkIn <= :end AND checkOut >= :start"),
		ExpressionAttributeNames: map[string]string{
			"#status": "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid":   &types.AttributeValueMemberS{Value: villaID},
			":conf":  &types.AttributeValueMemberS{Value: "CONFIRMED"},
			":start": &types.AttributeValueMemberS{Value: startDate.Format(time.RFC3339)},
			":end":   &types.AttributeValueMemberS{Value: endDate.Format(time.RFC3339)},
		},
	}

	bookings, err := d.Client.Query(ctx, bookingInput)
	if err != nil {
		return false, err
	}

	if len(bookings.Items) > 0 {
		return false, nil
	}

	// 2. Check blocked dates
	blockedInput := &dynamodb.QueryInput{
		TableName:              aws.String(d.BlockedDatesTable),
		IndexName:              aws.String("VillaBlockedIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		FilterExpression:       aws.String("startDate <= :end AND endDate >= :start"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid":   &types.AttributeValueMemberS{Value: villaID},
			":start": &types.AttributeValueMemberS{Value: startDate.Format(time.RFC3339)},
			":end":   &types.AttributeValueMemberS{Value: endDate.Format(time.RFC3339)},
		},
	}

	blocks, err := d.Client.Query(ctx, blockedInput)
	if err != nil {
		return false, err
	}

	return len(blocks.Items) == 0, nil
}

// GetUnavailableDates returns all dates that are blocked or booked for a villa
func (d *DynamoClient) GetUnavailableDates(ctx context.Context, villaID string, from, to time.Time) ([]map[string]string, error) {
	var unavailable []map[string]string

	// 1. Get blocked dates
	blockedInput := &dynamodb.QueryInput{
		TableName:              aws.String(d.BlockedDatesTable),
		IndexName:              aws.String("VillaBlockedIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid": &types.AttributeValueMemberS{Value: villaID},
		},
	}

	blockedResult, err := d.Client.Query(ctx, blockedInput)
	if err != nil {
		return nil, err
	}

	for _, item := range blockedResult.Items {
		var bd models.BlockedDate
		if err := attributevalue.UnmarshalMap(item, &bd); err == nil {
			unavailable = append(unavailable, map[string]string{
				"startDate": bd.StartDate.Format("2006-01-02"),
				"endDate":   bd.EndDate.Format("2006-01-02"),
				"reason":    "blocked",
			})
		}
	}

	// 2. Get confirmed bookings
	bookingInput := &dynamodb.QueryInput{
		TableName:              aws.String(d.BookingsTable),
		IndexName:              aws.String("VillaBookingsIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		FilterExpression:       aws.String("#status = :conf"),
		ExpressionAttributeNames: map[string]string{
			"#status": "status",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid":  &types.AttributeValueMemberS{Value: villaID},
			":conf": &types.AttributeValueMemberS{Value: "CONFIRMED"},
		},
	}

	bookingResult, err := d.Client.Query(ctx, bookingInput)
	if err != nil {
		return nil, err
	}

	for _, item := range bookingResult.Items {
		var b models.Booking
		if err := attributevalue.UnmarshalMap(item, &b); err == nil {
			unavailable = append(unavailable, map[string]string{
				"startDate": b.CheckIn.Format("2006-01-02"),
				"endDate":   b.CheckOut.Format("2006-01-02"),
				"reason":    "booked",
			})
		}
	}

	return unavailable, nil
}

// GetAllOffers returns all active offers
func (d *DynamoClient) GetAllOffers(ctx context.Context) ([]models.Offer, error) {
	input := &dynamodb.ScanInput{
		TableName:        aws.String(d.OffersTable),
		FilterExpression: aws.String("isActive = :active"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":active": &types.AttributeValueMemberBOOL{Value: true},
		},
	}

	result, err := d.Client.Scan(ctx, input)
	if err != nil {
		return nil, err
	}

	var offers []models.Offer
	err = attributevalue.UnmarshalListOfMaps(result.Items, &offers)
	return offers, err
}

// GetBookingsByUser returns all bookings for a given userId (phone)
func (d *DynamoClient) GetBookingsByUser(ctx context.Context, userID string) ([]models.Booking, error) {
	input := &dynamodb.QueryInput{
		TableName:              aws.String(d.BookingsTable),
		IndexName:              aws.String("UserBookingsIndex"),
		KeyConditionExpression: aws.String("userId = :uid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":uid": &types.AttributeValueMemberS{Value: userID},
		},
	}

	result, err := d.Client.Query(ctx, input)
	if err != nil {
		return nil, err
	}

	var bookings []models.Booking
	err = attributevalue.UnmarshalListOfMaps(result.Items, &bookings)
	return bookings, err
}

// SaveBooking stores a new booking record
func (d *DynamoClient) SaveBooking(ctx context.Context, booking *models.Booking) error {
	av, err := attributevalue.MarshalMap(booking)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String(d.BookingsTable),
		Item:      av,
	}

	_, err = d.Client.PutItem(ctx, input)
	return err
}

// GetBooking retrieves a booking by its id
func (d *DynamoClient) GetBooking(ctx context.Context, id string) (*models.Booking, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String(d.BookingsTable),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	}

	result, err := d.Client.GetItem(ctx, input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil
	}

	var booking models.Booking
	err = attributevalue.UnmarshalMap(result.Item, &booking)
	return &booking, err
}

// UpdateBookingStatus updates the status of a booking
func (d *DynamoClient) UpdateBookingStatus(ctx context.Context, id string, status string) error {
	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(d.BookingsTable),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
		UpdateExpression:          aws.String("SET #status = :status, updatedAt = :updatedAt"),
		ExpressionAttributeNames:  map[string]string{"#status": "status"},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":status":    &types.AttributeValueMemberS{Value: status},
			":updatedAt": &types.AttributeValueMemberS{Value: time.Now().Format(time.RFC3339)},
		},
	}

	_, err := d.Client.UpdateItem(ctx, input)
	return err
}

// SavePayment stores a payment record
func (d *DynamoClient) SavePayment(ctx context.Context, payment *models.Payment) error {
	av, err := attributevalue.MarshalMap(payment)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String(d.PaymentsTable),
		Item:      av,
	}

	_, err = d.Client.PutItem(ctx, input)
	return err
}

// DynamoClient holds the DynamoDB client and table names
type DynamoClient struct {
	Client            *dynamodb.Client
	UsersTable        string
	VillasTable       string
	BookingsTable     string
	OffersTable       string
	BlockedDatesTable string
	PaymentsTable     string
	DatePricingTable  string
}

// NewDynamoClient initializes and returns a DynamoClient
func NewDynamoClient(ctx context.Context) (*DynamoClient, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to load SDK config: %v", err)
	}

	client := dynamodb.NewFromConfig(cfg)

	return &DynamoClient{
		Client:            client,
		UsersTable:        getEnv("USERS_TABLE", "StayXLUsers"),
		VillasTable:       getEnv("VILLAS_TABLE", "StayXLVillas"),
		BookingsTable:     getEnv("BOOKINGS_TABLE", "StayXLBookings"),
		OffersTable:       getEnv("OFFERS_TABLE", "StayXLOffers"),
		BlockedDatesTable: getEnv("BLOCKED_DATES_TABLE", "StayXLBlockedDates"),
		PaymentsTable:     getEnv("PAYMENTS_TABLE", "StayXLPayments"),
		DatePricingTable:  getEnv("DATE_PRICING_TABLE", "StayXLDatePricing"),
	}, nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// ─── ADMIN: BLOCKED DATES ───

// SaveBlockedDate stores a blocked date range
func (d *DynamoClient) SaveBlockedDate(ctx context.Context, bd *models.BlockedDate) error {
	av, err := attributevalue.MarshalMap(bd)
	if err != nil {
		return err
	}
	_, err = d.Client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(d.BlockedDatesTable),
		Item:      av,
	})
	return err
}

// DeleteBlockedDate removes a blocked date range by ID
func (d *DynamoClient) DeleteBlockedDate(ctx context.Context, id string) error {
	_, err := d.Client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(d.BlockedDatesTable),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	return err
}

// GetBlockedDatesByVilla returns all blocked date ranges for a villa
func (d *DynamoClient) GetBlockedDatesByVilla(ctx context.Context, villaID string) ([]models.BlockedDate, error) {
	result, err := d.Client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(d.BlockedDatesTable),
		IndexName:              aws.String("VillaBlockedIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid": &types.AttributeValueMemberS{Value: villaID},
		},
	})
	if err != nil {
		return nil, err
	}
	var dates []models.BlockedDate
	err = attributevalue.UnmarshalListOfMaps(result.Items, &dates)
	return dates, err
}

// ─── ADMIN: DATE PRICING ───

// SaveDatePricing stores a date-specific price override
func (d *DynamoClient) SaveDatePricing(ctx context.Context, dp *models.DatePricing) error {
	av, err := attributevalue.MarshalMap(dp)
	if err != nil {
		return err
	}
	_, err = d.Client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(d.DatePricingTable),
		Item:      av,
	})
	return err
}

// DeleteDatePricing removes a date-specific price override by ID
func (d *DynamoClient) DeleteDatePricing(ctx context.Context, id string) error {
	_, err := d.Client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(d.DatePricingTable),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	return err
}

// GetDatePricingByVilla returns all date-specific price overrides for a villa
func (d *DynamoClient) GetDatePricingByVilla(ctx context.Context, villaID string) ([]models.DatePricing, error) {
	result, err := d.Client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(d.DatePricingTable),
		IndexName:              aws.String("VillaPricingIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid": &types.AttributeValueMemberS{Value: villaID},
		},
	})
	if err != nil {
		return nil, err
	}
	var pricing []models.DatePricing
	err = attributevalue.UnmarshalListOfMaps(result.Items, &pricing)
	return pricing, err
}

// UpdateVillaPrice updates the base pricePerNight of a villa
func (d *DynamoClient) UpdateVillaPrice(ctx context.Context, villaID string, newPrice int) error {
	_, err := d.Client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: aws.String(d.VillasTable),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: villaID},
		},
		UpdateExpression: aws.String("SET pricePerNight = :price, updatedAt = :updatedAt"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":price":     &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", newPrice)},
			":updatedAt": &types.AttributeValueMemberS{Value: time.Now().Format(time.RFC3339)},
		},
	})
	return err
}

// GetDatePricingInRange returns all price overrides for a villa within a specific date range
func (d *DynamoClient) GetDatePricingInRange(ctx context.Context, villaID string, startDate, endDate string) ([]models.DatePricing, error) {
	// We use the VillaPricingIndex (GSI: villaId) and filter by date
	// Note: Since 'date' is a string YYYY-MM-DD, lexicographical comparison works
	result, err := d.Client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(d.DatePricingTable),
		IndexName:              aws.String("VillaPricingIndex"),
		KeyConditionExpression: aws.String("villaId = :vid"),
		FilterExpression:       aws.String("#d >= :start AND #d < :end"), // Exclusive of end date (checkout)
		ExpressionAttributeNames: map[string]string{
			"#d": "date",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":vid":   &types.AttributeValueMemberS{Value: villaID},
			":start": &types.AttributeValueMemberS{Value: startDate},
			":end":   &types.AttributeValueMemberS{Value: endDate},
		},
	})
	if err != nil {
		return nil, err
	}
	var pricing []models.DatePricing
	err = attributevalue.UnmarshalListOfMaps(result.Items, &pricing)
	return pricing, err
}
