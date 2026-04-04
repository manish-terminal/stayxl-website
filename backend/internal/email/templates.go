package email

import (
	"fmt"
	"stayxl-backend/internal/models"
	"strings"
)

func GenerateBookingHTML(booking models.Booking) string {
	addonList := ""
	if len(booking.Addons) > 0 {
		addonList = "<h3>Experiences & Add-Ons</h3><ul style='list-style:none;padding:0;'>"
		for _, a := range booking.Addons {
			addonList += fmt.Sprintf("<li style='margin-bottom:8px;'>✨ %s - ₹%d</li>", a.Name, a.Price*a.Quantity)
		}
		addonList += "</ul>"
	}

	paymentDetails := ""
	if booking.PaymentMode == "ADVANCE" {
		paymentDetails = fmt.Sprintf(`
			<p><strong>Advance Paid:</strong> ₹%d</p>
			<p style="color: #e67e22;"><strong>Balance Due at Check-in:</strong> ₹%d</p>
		`, booking.AdvanceAmount, booking.BalanceAmount)
	} else {
		paymentDetails = fmt.Sprintf("<p><strong>Full Payment Received:</strong> ₹%d</p>", booking.TotalAmount)
	}

	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { background-color: #072720; color: white; padding: 40px; text-align: center; border-radius: 16px 16px 0 0; }
        .content { background-color: #ffffff; padding: 40px; border: 1px solid #eee; border-radius: 0 0 16px 16px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        h1 { margin: 0; font-size: 24px; font-weight: 500; }
        h2 { color: #072720; font-size: 20px; margin-top: 0; }
        .button { background-color: #072720; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin-top: 20px; }
        .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px; }
        .price-breakdown { border-top: 1px solid #eee; margin-top: 30px; pt: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed!</h1>
            <p>Your luxury getaway at StayXL is ready.</p>
        </div>
        <div class="content">
            <h2>Hi %s,</h2>
            <p>Pack your bags! Your stay at <strong>%s</strong> has been successfully booked.</p>
            
            <div class="details-grid">
                <div>
                    <p style="font-size: 12px; color: #999; margin: 0; text-transform: uppercase;">Check-in</p>
                    <p style="margin: 4px 0; font-weight: 600;">%s</p>
                </div>
                <div>
                    <p style="font-size: 12px; color: #999; margin: 0; text-transform: uppercase;">Check-out</p>
                    <p style="margin: 4px 0; font-weight: 600;">%s</p>
                </div>
            </div>

            %s

            <div class="price-breakdown">
                <h3>Payment Summary</h3>
                <p><strong>Base Amount:</strong> ₹%d</p>
                %s
                <p><strong>Taxes (18%%):</strong> ₹%d</p>
                <p><strong>Security Deposit (Refundable):</strong> ₹%d</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 18px; color: #072720;"><strong>Total Amount:</strong> ₹%d</p>
                %s
            </div>

            <p style="margin-top: 40px;">Booking ID: <strong>#%s</strong></p>
            
            <a href="https://stayxl.com/bookings" class="button">Manage Your Booking</a>
        </div>
        <div class="footer">
            <p>&copy; 2026 StayXL Luxury Villas. All rights reserved.</p>
            <p>Need help? Contact us at support@stayxl.com</p>
        </div>
    </div>
</body>
</html>
	`, 
	booking.GuestName,
	booking.VillaName,
	booking.CheckIn.Format("Mon, 02 Jan 2006"),
	booking.CheckOut.Format("Mon, 02 Jan 2006"),
	addonList,
	booking.BaseAmount,
	getDiscountLine(booking),
	booking.TaxAmount,
	booking.SecurityDeposit,
	booking.TotalAmount,
	paymentDetails,
	strings.ToUpper(booking.ID[len(booking.ID)-8:]))
}

func getDiscountLine(booking models.Booking) string {
	if booking.DiscountAmount > 0 {
		return fmt.Sprintf("<p style='color: #27ae60;'><strong>Discount:</strong> -₹%d</p>", booking.DiscountAmount)
	}
	return ""
}

func GenerateBookingText(booking models.Booking) string {
	return fmt.Sprintf(`
Booking Confirmed!
Hi %s, your stay at %s is confirmed.

Check-in: %s
Check-out: %s

Total Amount: ₹%d
Booking ID: #%s

View details at: https://stayxl.com/bookings
	`,
	booking.GuestName,
	booking.VillaName,
	booking.CheckIn.Format("02 Jan 2006"),
	booking.CheckOut.Format("02 Jan 2006"),
	booking.TotalAmount,
	strings.ToUpper(booking.ID[len(booking.ID)-8:]))
}
