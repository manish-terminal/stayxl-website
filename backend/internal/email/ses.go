package email

import (
	"context"
	"fmt"
	"log"
	"stayxl-backend/internal/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
)

type EmailService struct {
	client *sesv2.Client
	from   string
}

func NewEmailService(ctx context.Context, fromEmail string) (*EmailService, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to load SDK config, %v", err)
	}

	client := sesv2.NewFromConfig(cfg)
	return &EmailService{
		client: client,
		from:   fromEmail,
	}, nil
}

func (s *EmailService) SendBookingConfirmation(ctx context.Context, booking models.Booking) error {
	if booking.GuestEmail == "" {
		log.Printf("⚠️ Skipping email: No email address for booking %s", booking.ID)
		return nil
	}

	htmlContent := GenerateBookingHTML(booking)
	textContent := GenerateBookingText(booking)

	input := &sesv2.SendEmailInput{
		FromEmailAddress: aws.String(s.from),
		Destination: &types.Destination{
			ToAddresses: []string{booking.GuestEmail},
		},
		Content: &types.EmailContent{
			Simple: &types.Message{
				Subject: &types.Content{
					Data: aws.String(fmt.Sprintf("Booking Confirmed: Luxury stay at %s", booking.VillaName)),
				},
				Body: &types.Body{
					Html: &types.Content{
						Data: aws.String(htmlContent),
					},
					Text: &types.Content{
						Data: aws.String(textContent),
					},
				},
			},
		},
	}

	_, err := s.client.SendEmail(ctx, input)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("✅ Booking confirmation email sent to %s for booking %s", booking.GuestEmail, booking.ID)
	return nil
}
