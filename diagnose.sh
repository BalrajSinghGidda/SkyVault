#!/bin/bash

# SkyVault CORS & Connection Diagnostic Tool

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    🔍 SkyVault Diagnostic Tool - CORS & Connection Check      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Backend Running?
echo -e "${BLUE}🔹 Test 1: Backend Server${NC}"
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Backend is running on port 5000${NC}"
  response=$(curl -s http://localhost:5000/api/health)
  echo "   Response: $response"
else
  echo -e "${RED}❌ Backend NOT running on port 5000${NC}"
  echo "   Fix: cd backend && npm run dev"
fi
echo ""

# Test 2: Frontend Running?
echo -e "${BLUE}🔹 Test 2: Frontend Server${NC}"
if curl -s http://localhost:8000 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Frontend is running on port 8000${NC}"
else
  echo -e "${YELLOW}⚠️  Frontend NOT responding on port 8000${NC}"
  echo "   Fix: cd frontend && python -m http.server 8000"
fi
echo ""

# Test 3: CORS Headers
echo -e "${BLUE}🔹 Test 3: CORS Headers${NC}"
cors_response=$(curl -s -i -X OPTIONS http://localhost:5000/api/health 2>&1 | grep -i "access-control")
if [ -n "$cors_response" ]; then
  echo -e "${GREEN}✅ CORS headers present${NC}"
  echo "$cors_response"
else
  echo -e "${RED}❌ No CORS headers found${NC}"
fi
echo ""

# Test 4: API Endpoints
echo -e "${BLUE}🔹 Test 4: API Endpoints${NC}"
echo "   Testing /api/health endpoint:"
health=$(curl -s http://localhost:5000/api/health)
if [ -n "$health" ]; then
  echo -e "   ${GREEN}✅ Response:${NC} $health"
else
  echo -e "   ${RED}❌ No response${NC}"
fi
echo ""

# Test 5: Port Availability
echo -e "${BLUE}🔹 Test 5: Port Status${NC}"
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo -e "   ${GREEN}✅ Port 5000 (Backend) - LISTENING${NC}"
else
  echo -e "   ${RED}❌ Port 5000 (Backend) - NOT LISTENING${NC}"
fi

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo -e "   ${GREEN}✅ Port 8000 (Frontend) - LISTENING${NC}"
else
  echo -e "   ${YELLOW}⚠️  Port 8000 (Frontend) - NOT LISTENING${NC}"
fi
echo ""

# Test 6: Node Process
echo -e "${BLUE}🔹 Test 6: Node Process${NC}"
if pgrep -f "node.*server.js" > /dev/null; then
  echo -e "   ${GREEN}✅ Node process running${NC}"
  node_pid=$(pgrep -f "node.*server.js")
  echo "   PID: $node_pid"
else
  echo -e "   ${RED}❌ Node process NOT found${NC}"
  echo "   Fix: cd backend && npm run dev"
fi
echo ""

# Test 7: MongoDB Connection
echo -e "${BLUE}🔹 Test 7: Database Check${NC}"
# This would need mongosh installed, so we check via API instead
response=$(curl -s http://localhost:5000/api/health)
if echo "$response" | grep -q "Server running"; then
  echo -e "   ${GREEN}✅ Backend responding (DB might be connected)${NC}"
else
  echo -e "   ${RED}❌ Backend not responding properly${NC}"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        📋 Summary                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}If you see any ❌ marks, follow the suggested fixes above.${NC}"
echo ""
echo -e "${BLUE}Quick Start:${NC}"
echo "  1. Terminal 1: cd backend && npm run dev"
echo "  2. Terminal 2: cd frontend && python -m http.server 8000"
echo "  3. Browser:    http://localhost:8000"
echo ""
echo -e "${BLUE}Read more:${NC}"
echo "  - CORS_TROUBLESHOOTING.md"
echo "  - README.md"
echo ""
