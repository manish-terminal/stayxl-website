# StayXL - AWS Serverless Backend (Go)

## Objective
The objective of this backend is to provide a high-performance, cost-effective, and scalable API for StayXL, migrating away from Supabase. 

- **Strategy**: Keep heavy, static villa content (images, stories, amenities) on the frontend to reduce database complexity and latency.
- **Dynamic Data**: Only "transactional" and "frequently changing" data is stored in AWS DynamoDB:
  - **Bookings**: All guest reservations.
  - **Dynamic Pricing**: Base price per night for each villa.
  - **Availability**: Blocked dates and existing booking date ranges.
  - **Offers**: Coupon codes and discount rules.
  - **Users**: User profiles and authentication state.

---

## Deployment on AWS

This project uses the **AWS Serverless Application Model (SAM)**.

### Prerequisites
- AWS CLI configured
- AWS SAM CLI installed
- Go 1.22+ installed

### Steps
1. **Build**:
   ```bash
   cd backend
   sam build
   ```
2. **Deploy**:
   ```bash
   sam deploy --guided
   ```
   *Follow the prompts to set your stack name and region.*

3. **Get Endpoint**:
   The deployment output will provide an `ApiEndpoint`. Update your frontend `.env` with this URL.

---

## API Endpoints

### 1. Villas (Pricing & Status Only)
*Objective: Fetch only the data needed for booking calculations.*

- `GET /api/villas/{slug}`
  - **Response**:
    ```json
    {
      "id": "v-123",
      "slug": "luxury-villa-goa",
      "pricePerNight": 25000,
      "isActive": true
    }
    ```

### 2. Bookings
*Objective: Create and manage stay reservations.*

- `POST /api/bookings`
  - **Request Body**:
    ```json
    {
      "villaId": "v-123",
      "checkIn": "2024-12-01T00:00:00Z",
      "checkOut": "2024-12-05T00:00:00Z",
      "guests": 4,
      "couponCode": "STAY10"
    }
    ```
  - **Response**: `201 Created` with Booking ID and Razorpay Order details.

- `GET /api/bookings/{id}`
  - **Response**: Detailed booking status and guest info.

### 3. Blocked Dates
*Objective: Manage villa availability for maintenance or external bookings.*

- `GET /api/admin/block-dates?villaId={id}`
  - **Response**: List of date objects.
- `POST /api/admin/block-dates`
  - **Request Body**: `{"villaId": "...", "dates": ["2024-10-10", "..."], "reason": "..."}`

### 4. Authentication (OTP Flow)
*Objective: Secure user login without external providers like Supabase Auth.*

- `POST /api/auth/otp`
  - **Request**: `{"email": "...", "phone": "..."}`
- `POST /api/auth/verify`
  - **Request**: `{"id": "...", "code": "123456"}`
  - **Response**: JWT Token.

---

## DynamoDB Schema
Three main tables are managed by SAM:
- `StayXLUsers`: Key `id` (S), GSI `EmailIndex`
- `StayXLVillas`: Key `id` (S), GSI `SlugIndex`
- `StayXLBookings`: Key `id` (S), GSIs für `userId` and `villaId`
