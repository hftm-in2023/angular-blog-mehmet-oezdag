#!/bin/bash

# Angular Blog Development Start Script
# Startet Backend und Frontend parallel

echo "🚀 Starting Angular Blog Development Environment..."
echo "==========================================="

# Prüfe ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installieren Sie Node.js und versuchen Sie es erneut."
    exit 1
fi

# Prüfe ob npm installiert ist
if ! command -v npm &> /dev/null; then
    echo "❌ npm ist nicht installiert. Bitte installieren Sie npm und versuchen Sie es erneut."
    exit 1
fi

# Quarkus Dependencies prüfen falls Java verfügbar ist
if command -v java &> /dev/null; then
    echo "☕ Java found, using Quarkus Backend"
    BACKEND_TYPE="quarkus"
else
    echo "⚠️  Java not found, falling back to Express.js Backend"
    BACKEND_TYPE="express"
fi

# Backend Dependencies installieren je nach Typ
if [ "$BACKEND_TYPE" = "quarkus" ]; then
    echo "📦 Preparing Quarkus backend..."
    cd quarkus-backend && ./mvnw compile quarkus:dev &
    BACKEND_PID=$!
    cd ..
else
    if [ ! -d "backend/node_modules" ]; then
        echo "📦 Installing Express.js backend dependencies..."
        cd backend && npm install && cd ..
    fi
    cd backend && npm start &
    BACKEND_PID=$!
    cd ..
fi

# Frontend Dependencies installieren falls nicht vorhanden
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🖥️  Starting Backend Server (Port 3000) - Type: $BACKEND_TYPE"
echo "🌐 Starting Angular Frontend (Port 4200)..."
echo ""
echo "📝 Logs:"
echo "==========================================="

# Starte Frontend
npm start &
FRONTEND_PID=$!

# Warte auf Ctrl+C
wait 