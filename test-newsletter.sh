#!/bin/bash

echo "🧪 Testing Newsletter API..."

# Test 1: Valid email
echo ""
echo "Test 1: Valid email"
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "---"

# Test 2: Invalid email
echo ""
echo "Test 2: Invalid email"
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "---"

# Test 3: Missing email
echo ""
echo "Test 3: Missing email"
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Tests complete!"

