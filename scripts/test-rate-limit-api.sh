#!/bin/bash

# Test Rate Limiting on Running Dev Server
# Usage: ./scripts/test-rate-limit-api.sh

echo "🧪 Testing Rate Limiting on /api/chat endpoint"
echo "⏱️  Limit: 30 requests per minute"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test endpoint
ENDPOINT="http://localhost:3001/api/chat"

# Make 35 requests to test rate limiting
for i in {1..35}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"test"}]}')

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

  if [ "$HTTP_CODE" = "429" ]; then
    echo -e "${RED}Request $i: BLOCKED (429 - Rate Limited)${NC}"
  elif [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "500" ]; then
    echo -e "${GREEN}Request $i: PASSED ($HTTP_CODE)${NC}"
  else
    echo "Request $i: $HTTP_CODE"
  fi

  # Small delay to avoid overwhelming the server
  sleep 0.1
done

echo ""
echo "✅ Test complete! Expected: ~30 passed, ~5 blocked"
