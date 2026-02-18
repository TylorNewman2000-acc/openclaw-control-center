#!/bin/bash
# Test script to verify all API endpoints return valid JSON

set -e

API_BASE="${API_BASE:-http://127.0.0.1:8780}"

echo "Testing OpenClaw Control Center API..."
echo "API Base: $API_BASE"
echo ""

# Test health endpoint
echo "1. Testing /health..."
curl -s "$API_BASE/health" | jq -e . > /dev/null && echo "✓ /health returns valid JSON"

# Test info endpoint
echo "2. Testing / (info)..."
curl -s "$API_BASE/" | jq -e . > /dev/null && echo "✓ / returns valid JSON"

# Test tasks endpoint
echo "3. Testing /tasks..."
curl -s "$API_BASE/tasks" | jq -e . > /dev/null && echo "✓ /tasks returns valid JSON"

# Test tasks with state filter
echo "4. Testing /tasks?state=closed..."
curl -s "$API_BASE/tasks?state=closed" | jq -e . > /dev/null && echo "✓ /tasks?state=closed returns valid JSON"

# Test tasks with state=all
echo "5. Testing /tasks?state=all..."
curl -s "$API_BASE/tasks?state=all" | jq -e . > /dev/null && echo "✓ /tasks?state=all returns valid JSON"

# Test cursor-runs endpoint
echo "6. Testing /cursor-runs..."
curl -s "$API_BASE/cursor-runs" | jq -e . > /dev/null && echo "✓ /cursor-runs returns valid JSON"

echo ""
echo "All tests passed! ✓"
echo ""
echo "Sample responses:"
echo "=================="
echo ""
echo "GET /:"
curl -s "$API_BASE/" | jq .
echo ""
echo "GET /tasks:"
curl -s "$API_BASE/tasks" | jq .
echo ""
echo "GET /cursor-runs:"
curl -s "$API_BASE/cursor-runs" | jq .
