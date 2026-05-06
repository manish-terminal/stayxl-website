#!/bin/bash
BASE_URL="https://zu57acxuwj.execute-api.ap-south-1.amazonaws.com/Prod"

echo "--- 1. Health ---"
curl -w "\nStatus: %{http_code}\n" -s "$BASE_URL/health"

echo -e "\n--- 2. Villas Listing ---"
curl -w "\nStatus: %{http_code}\n" -s "$BASE_URL/api/villas"

echo -e "\n--- 3. Samaya Availability ---"
curl -w "\nStatus: %{http_code}\n" -s "$BASE_URL/api/villas/samaya-villa-hyderabad/availability?startDate=2026-04-10T00:00:00Z&endDate=2026-04-12T00:00:00Z"

echo -e "\n--- 4. Auth: Send OTP ---"
curl -w "\nStatus: %{http_code}\n" -s -X POST "$BASE_URL/api/auth/send-otp" -d '{"phone": "9876543210"}'

echo -e "\n--- 5. Auth: Verify OTP ---"
curl -w "\nStatus: %{http_code}\n" -s -X POST "$BASE_URL/api/auth/verify-otp" -d '{"phone": "9876543210", "otp": "123456"}'

echo -e "\n--- 6. Invalid Slug Test ---"
curl -w "\nStatus: %{http_code}\n" -s "$BASE_URL/api/villas/non-existent-villa/availability?startDate=2026-04-10T00:00:00Z&endDate=2026-04-12T00:00:00Z"
