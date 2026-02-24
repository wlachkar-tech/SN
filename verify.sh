#!/bin/bash

# Student Management App - Setup Verification Script
# This script verifies the installation of the application

echo "==============================================="
echo "Student Management App - Setup Verification"
echo "==============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="✓"
cross_mark="✗"

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}${check_mark}${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}${cross_mark}${NC} Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
echo ""
echo -e "${YELLOW}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}${check_mark}${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}${cross_mark}${NC} npm not found"
    exit 1
fi

# Check project structure
echo ""
echo -e "${YELLOW}Checking project structure...${NC}"

DIRS=("backend" "frontend" "backend/routes" "backend/middleware" "frontend/app" "frontend/components")

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}${check_mark}${NC} $dir exists"
    else
        echo -e "${RED}${cross_mark}${NC} $dir not found"
    fi
done

# Check important files
echo ""
echo -e "${YELLOW}Checking important files...${NC}"

FILES=("backend/package.json" "backend/server.js" "backend/database.js" "frontend/package.json" "frontend/next.config.js" "README.md")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}${check_mark}${NC} $file exists"
    else
        echo -e "${RED}${cross_mark}${NC} $file not found"
    fi
done

# Check backend node_modules
echo ""
echo -e "${YELLOW}Checking backend dependencies...${NC}"
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}${check_mark}${NC} Backend node_modules exists"
else
    echo -e "${YELLOW}⚠${NC} Backend node_modules not found"
    echo "  Run: cd backend && npm install"
fi

# Check frontend node_modules
echo ""
echo -e "${YELLOW}Checking frontend dependencies...${NC}"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}${check_mark}${NC} Frontend node_modules exists"
else
    echo -e "${YELLOW}⚠${NC} Frontend node_modules not found"
    echo "  Run: cd frontend && npm install"
fi

# Check environment files
echo ""
echo -e "${YELLOW}Checking environment files...${NC}"

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}${check_mark}${NC} backend/.env exists"
else
    echo -e "${YELLOW}⚠${NC} backend/.env not found"
    echo "  Run: cd backend && cp .env.example .env"
fi

if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}${check_mark}${NC} frontend/.env.local exists"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env.local not found"
    echo "  Run: cd frontend && cp .env.local.example .env.local"
fi

# Summary
echo ""
echo "==============================================="
echo -e "${GREEN}Verification Complete!${NC}"
echo "==============================================="
echo ""
echo "Next steps:"
echo "1. Configure environment files if needed"
echo "2. Run: npm run dev (from root directory)"
echo "3. Backend will start on http://localhost:5000"
echo "4. Frontend will start on http://localhost:3000"
echo ""
echo "For detailed setup instructions, see GETTING_STARTED.md"
echo ""
