#!/bin/bash
echo "=== BASELINE LOAD TEST ==="

# Warm up
curl -s http://localhost:3000/health > /dev/null

# 1000 concurrent users x 30 seconds
# NOTE: target /api/shorten so POST Lua script matches
wrk -t12 -c1000 -d30s -s load-script.lua http://localhost:3000/api/shorten

echo ""
echo "=== SINGLE ENDPOINT TESTS ==="

# POST /api/shorten with JSON body
wrk -t4 -c200 -d15s \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 1.2.3.4" \
  -s post-script.lua \
  http://localhost:3000/api/shorten

# Redirect test on one short code (replace abc123 with a real code)
wrk -t4 -c500 -d15s http://localhost:3000/abc123
